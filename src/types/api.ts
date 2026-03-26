import type { BotConfig, BotStatus } from './bot'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export type StartBotRequest = BotConfig
export type StartBotResponse = ApiResponse<{ message: string }>
export type StopBotResponse = ApiResponse<{ message: string }>
export type StatusResponse = ApiResponse<BotStatus>

export interface AssetBalance {
  asset: string
  free: number
  locked: number
}

export interface BalanceData {
  balances: AssetBalance[]
  pair: string
  /** Quote asset, e.g. USDT */
  quoteAsset: string
  /** Free quote balance (limit for new buy margin / deposit cap) */
  quoteFree: number
  quoteLocked: number
  /** Base asset, e.g. BTC */
  baseAsset: string
  baseFree: number
  baseLocked: number
  /** Same as quoteFree when quote is USDT */
  usdtFree: number | null
  /** ISO 8601 UTC when balances were read */
  updatedAt: string
}

export type BalanceResponse = ApiResponse<BalanceData>

/** Result of POST /verify-credentials — Binance account summary (no raw balances) */
export interface VerifyCredentialsData {
  accountType: string
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  permissions: string[]
  nonZeroBalances: number
  totalBalanceEntries: number
}

export type VerifyCredentialsResponse = ApiResponse<VerifyCredentialsData>
