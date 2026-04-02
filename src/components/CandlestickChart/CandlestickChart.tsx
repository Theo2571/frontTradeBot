import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  type UTCTimestamp,
} from 'lightweight-charts'
import { useBotStatus } from '@/hooks/useBotStatus'
import { useKlines, type KLine } from '@/hooks/useKlines'
import type { KlineInterval } from '@/services/binanceService'
import type { Order } from '@/types/bot'
import type { ThemeMode } from '@/store/uiStore'
import { IntervalSelector } from './IntervalSelector'
import {
  darkChartOptions,
  lightChartOptions,
  candleSeriesOptions,
  ORDER_BUY_COLOR,
  ORDER_SELL_COLOR,
  priceLineBaseOptions,
} from './chartTheme'

// ── Types ─────────────────────────────────────────────────────────────────────

interface CandlestickChartProps {
  /** Trading pair symbol, e.g. 'BTCUSDT' */
  symbol: string
  /**
   * Current app theme — passed as a prop instead of reading useUiStore directly
   * so the component stays decoupled from the global store and is easier to test.
   */
  theme: ThemeMode
}

// ── Module-level constants & helpers ─────────────────────────────────────────

/** Stable empty array — prevents the price-line effect from re-running
 *  when status is undefined (no credentials yet). */
const EMPTY_ORDERS: Order[] = []

/** Casts a plain Unix-second number to lightweight-charts' branded UTCTimestamp */
const toTs = (t: number) => t as UTCTimestamp

/** Maps a KLine to a candlestick bar for lightweight-charts */
const toBar = (k: KLine) => ({
  time: toTs(k.time),
  open: k.open,
  high: k.high,
  low: k.low,
  close: k.close,
})

/**
 * Maps a KLine to a volume histogram bar.
 * Color matches the candle direction (green = up, red = down) at 40% opacity.
 */
const toVolumeBar = (k: KLine) => ({
  time: toTs(k.time),
  value: k.volume,
  color: k.close >= k.open ? 'rgba(14,203,129,0.4)' : 'rgba(246,70,93,0.4)',
})

/**
 * Formats an order amount for display in the axis label.
 * 0.00151234 → "0.001512"  |  1.5 → "1.5"  |  100 → "100"
 */
const fmtAmount = (amount: number): string => {
  if (amount >= 1) return amount.toFixed(2).replace(/\.?0+$/, '')
  const exp = Math.floor(Math.log10(Math.abs(amount)))
  const decimals = Math.max(0, -exp + 3)
  return amount.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '')
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * High-performance candlestick chart powered by TradingView lightweight-charts.
 *
 * Data sources:
 * - Klines: Binance public API, polled every 5 s via useKlines
 * - Orders: internal bot status via useBotStatus (same cache as OrdersTable)
 *
 * Features:
 * - Live candle update (series.update) vs new candle (series.setData + range restore)
 * - Volume histogram (bottom 15%, direction-coloured)
 * - BUY/SELL price-line overlay with axis badges
 * - Dark/light theme sync via applyOptions
 * - Responsive width via ResizeObserver
 * - Stale requests cancelled via AbortSignal (in useKlines → binanceService)
 */
export function CandlestickChart({ symbol, theme }: CandlestickChartProps) {
  const [interval, setSelectedInterval] = useState<KlineInterval>('1h')

  // ── Order data — same React Query cache as OrdersTable, no extra requests ──
  const { status } = useBotStatus()
  const activeOrders = status?.activeOrders ?? EMPTY_ORDERS
  const activeSellOrder = status?.activeSellOrder ?? null

  // ── Refs for imperative lightweight-charts API ────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  /**
   * Keeps theme accessible inside the mount effect without making theme a
   * reactive dependency (which would recreate the chart on every toggle).
   * We update it synchronously on every render so the mount effect always
   * sees the current value without needing it in the deps array.
   */
  const themeRef = useRef(theme)
  themeRef.current = theme
  /**
   * Tracks active price lines by a stable key:
   *   Order ID → BUY line  |  'sell' → SELL line
   */
  const priceLinesRef = useRef<Map<string, IPriceLine>>(new Map())
  /** Open time of the last rendered candle — drives update vs setData decision */
  const lastCandleTimeRef = useRef<number | null>(null)
  /** True until the first successful data load for the current symbol+interval */
  const isFirstLoadRef = useRef(true)

  const { data: klines, isLoading, isError } = useKlines(symbol, interval)

  // ── Chart initialisation (mount only) ────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    // themeRef.current is always up-to-date (assigned synchronously above)
    const themeOptions =
      themeRef.current === 'dark' ? darkChartOptions : lightChartOptions

    const chart = createChart(containerRef.current, {
      ...themeOptions,
      width: containerRef.current.clientWidth,
      height: 420,
      handleScroll: true,
      handleScale: true,
    })

    const series = chart.addSeries(CandlestickSeries, candleSeriesOptions)

    // Volume histogram — confined to the bottom 15% via a dedicated price scale
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      lastValueVisible: false,
      priceLineVisible: false,
    })
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
      borderVisible: false,
    })

    chartRef.current = chart
    seriesRef.current = series
    volumeSeriesRef.current = volumeSeries

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry && chartRef.current) {
        chartRef.current.applyOptions({ width: entry.contentRect.width })
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      volumeSeriesRef.current = null
      priceLinesRef.current.clear()
      lastCandleTimeRef.current = null
      isFirstLoadRef.current = true
    }
  }, []) // empty — chart created once; theme changes handled by the effect below

  // ── Theme sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!chartRef.current) return
    chartRef.current.applyOptions(
      theme === 'dark' ? darkChartOptions : lightChartOptions,
    )
  }, [theme])

  // ── Reset on symbol / interval change ────────────────────────────────────
  useEffect(() => {
    isFirstLoadRef.current = true
    lastCandleTimeRef.current = null
    if (seriesRef.current) {
      priceLinesRef.current.forEach((line) => {
        seriesRef.current!.removePriceLine(line)
      })
      priceLinesRef.current.clear()
    }
  }, [symbol, interval])

  // ── Data updates (every 5 s refetch) ─────────────────────────────────────
  useEffect(() => {
    if (!klines?.length || !seriesRef.current || !chartRef.current) return

    const series = seriesRef.current
    const volumeSeries = volumeSeriesRef.current
    const chart = chartRef.current
    const latestCandle = klines[klines.length - 1]
    if (!latestCandle) return

    if (isFirstLoadRef.current) {
      series.setData(klines.map(toBar))
      volumeSeries?.setData(klines.map(toVolumeBar))
      chart.timeScale().scrollToRealTime()
      lastCandleTimeRef.current = latestCandle.time
      isFirstLoadRef.current = false
      return
    }

    if (latestCandle.time === lastCandleTimeRef.current) {
      // Same candle still open — update in-place, viewport untouched
      series.update(toBar(latestCandle))
      volumeSeries?.update(toVolumeBar(latestCandle))
    } else {
      // New candle opened — bracket setData() with range save/restore
      const visibleRange = chart.timeScale().getVisibleLogicalRange()
      series.setData(klines.map(toBar))
      volumeSeries?.setData(klines.map(toVolumeBar))
      lastCandleTimeRef.current = latestCandle.time
      if (visibleRange) {
        chart.timeScale().setVisibleLogicalRange(visibleRange)
      }
    }
  }, [klines])

  // ── Order price-line management ───────────────────────────────────────────
  useEffect(() => {
    const series = seriesRef.current
    if (!series) return

    const currentLines = priceLinesRef.current
    const desiredBuyIds = new Set(activeOrders.map((o) => o.id))
    const hasSell = activeSellOrder !== null

    // Remove stale lines
    currentLines.forEach((line, key) => {
      const shouldRemove = key === 'sell' ? !hasSell : !desiredBuyIds.has(key)
      if (shouldRemove) {
        series.removePriceLine(line)
        currentLines.delete(key)
      }
    })

    // Add or update BUY lines
    activeOrders.forEach((order) => {
      const label = `BUY ${fmtAmount(order.amount)}`
      const existing = currentLines.get(order.id)
      if (existing) {
        existing.applyOptions({ title: label })
      } else {
        currentLines.set(
          order.id,
          series.createPriceLine({
            ...priceLineBaseOptions,
            price: order.price,
            color: ORDER_BUY_COLOR,
            axisLabelColor: ORDER_BUY_COLOR,
            title: label,
          }),
        )
      }
    })

    // Add or update SELL line
    if (hasSell) {
      const label = `SELL ${fmtAmount(activeSellOrder!.amount)}`
      const existingSell = currentLines.get('sell')
      if (existingSell) {
        existingSell.applyOptions({ price: activeSellOrder!.price, title: label })
      } else {
        currentLines.set(
          'sell',
          series.createPriceLine({
            ...priceLineBaseOptions,
            price: activeSellOrder!.price,
            color: ORDER_SELL_COLOR,
            axisLabelColor: ORDER_SELL_COLOR,
            title: label,
          }),
        )
      }
    }
  // symbol + interval re-runs this effect after the reset effect clears the map,
  // so price lines are immediately restored when the user switches interval/symbol.
  }, [activeOrders, activeSellOrder, symbol, interval])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-lg border border-brand-border overflow-hidden"
      style={{ background: 'var(--brand-surface)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {symbol}
          </span>
          <span className="text-xs text-[var(--text-muted)]">Candlestick</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse-slow" />
            Live
          </span>
          <IntervalSelector value={interval} onChange={setSelectedInterval} />
        </div>
      </div>

      {/* Chart area */}
      <div className="relative" style={{ minHeight: '420px' }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--brand-surface)]/80">
            <span className="text-sm text-[var(--text-muted)]">Loading chart…</span>
          </div>
        )}
        {isError && !isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-sm text-[#f6465d]">Failed to load chart data</span>
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </div>
  )
}
