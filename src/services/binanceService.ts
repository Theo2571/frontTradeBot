import axios from 'axios'

/** Supported kLine intervals */
export type KlineInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

/** A single candlestick data point (time in Unix seconds for lightweight-charts) */
export interface KLine {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

/**
 * Separate axios instance for the public Binance REST API.
 * Uses its own baseURL so it bypasses the app's internal /api proxy.
 */
const binanceHttp = axios.create({
  baseURL: 'https://api.binance.com',
  timeout: 10_000,
})

/**
 * Fetch candlestick (kLine) data from the Binance public API.
 * @param symbol  Trading pair, e.g. 'BTCUSDT'
 * @param interval  Candlestick interval
 * @param limit  Number of candles to fetch (max 1000, default 500)
 */
export async function fetchKlines(
  symbol: string,
  interval: KlineInterval,
  limit = 500,
  signal?: AbortSignal,
): Promise<KLine[]> {
  const { data } = await binanceHttp.get<unknown[][]>('/api/v3/klines', {
    params: { symbol, interval, limit },
    signal, // axios respects AbortSignal — cancelled when interval/symbol changes
  })

  return data.map((k) => ({
    // k[0] = open time in milliseconds → convert to seconds for lightweight-charts
    time: Math.floor((k[0] as number) / 1000),
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[5] as string),
  }))
}
