import { useQuery } from '@tanstack/react-query'
import { fetchKlines, type KlineInterval, type KLine } from '@/services/binanceService'

export type { KLine }

/**
 * Fetches and auto-refreshes candlestick data from Binance.
 *
 * - refetchInterval: 5 s — live candle updates
 * - staleTime: 4 s — avoids redundant in-flight requests
 * - refetchIntervalInBackground: false — pauses polling when the tab is hidden
 *   (saves Binance API quota and user bandwidth)
 * - AbortSignal passed through to axios so stale requests are cancelled
 *   immediately when the user switches interval/symbol
 */
export function useKlines(symbol: string, interval: KlineInterval) {
  return useQuery({
    queryKey: ['klines', symbol, interval],
    queryFn: ({ signal }) => fetchKlines(symbol, interval, 500, signal),
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    staleTime: 4_000,
    refetchOnWindowFocus: false,
    retry: 2,
  })
}
