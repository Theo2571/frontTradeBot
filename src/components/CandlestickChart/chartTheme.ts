import { ColorType } from 'lightweight-charts'

/**
 * Chart theme tokens derived from the app's CSS design tokens.
 *
 * Dark mode  → matches  --brand-surface: #131928, --brand-border: #1e2d45
 * Light mode → matches  --brand-surface: #ffffff, --brand-border: #e2e8f0
 *
 * Candle and order-line colors use Binance Futures palette (same in both themes).
 */

// ── Candle colors ────────────────────────────────────────────────────────────
export const CANDLE_UP_COLOR = '#0ecb81'    // bullish / green
export const CANDLE_DOWN_COLOR = '#f6465d'  // bearish / red
export const CANDLE_WICK_UP = '#0ecb81'
export const CANDLE_WICK_DOWN = '#f6465d'

// ── Order price-line colors ──────────────────────────────────────────────────
export const ORDER_BUY_COLOR = '#0ecb81'    // active BUY grid orders
export const ORDER_SELL_COLOR = '#f6465d'   // active SELL order

// ── Shared price-line base options (applied to both BUY and SELL) ─────────────
export const priceLineBaseOptions = {
  lineWidth: 1 as const,
  lineStyle: 1 as const, // LineStyle.Dotted — тонкая точечная, как на Binance Futures
  axisLabelVisible: true,
  axisLabelTextColor: '#ffffff',
} as const

// ── Shared candle series options (color, no border) ──────────────────────────
export const candleSeriesOptions = {
  upColor: CANDLE_UP_COLOR,
  downColor: CANDLE_DOWN_COLOR,
  borderVisible: false,
  wickUpColor: CANDLE_WICK_UP,
  wickDownColor: CANDLE_WICK_DOWN,
} as const

// ── Chart layout options per theme ───────────────────────────────────────────

export const darkChartOptions = {
  layout: {
    background: { type: ColorType.Solid, color: '#131928' },
    textColor: '#94a3b8',
    fontSize: 12,
  },
  grid: {
    vertLines: { color: '#1e2d45' },
    horzLines: { color: '#1e2d45' },
  },
  crosshair: {
    vertLine: { color: '#94a3b8', width: 1 as const, style: 3 },
    horzLine: { color: '#94a3b8', width: 1 as const, style: 3 },
  },
  rightPriceScale: {
    borderColor: '#1e2d45',
    textColor: '#94a3b8',
  },
  timeScale: {
    borderColor: '#1e2d45',
    textColor: '#94a3b8',
    timeVisible: true,
    secondsVisible: false,
  },
} as const

export const lightChartOptions = {
  layout: {
    background: { type: ColorType.Solid, color: '#ffffff' },
    textColor: '#64748b',
    fontSize: 12,
  },
  grid: {
    vertLines: { color: '#e2e8f0' },
    horzLines: { color: '#e2e8f0' },
  },
  crosshair: {
    vertLine: { color: '#94a3b8', width: 1 as const, style: 3 },
    horzLine: { color: '#94a3b8', width: 1 as const, style: 3 },
  },
  rightPriceScale: {
    borderColor: '#e2e8f0',
    textColor: '#64748b',
  },
  timeScale: {
    borderColor: '#e2e8f0',
    textColor: '#64748b',
    timeVisible: true,
    secondsVisible: false,
  },
} as const
