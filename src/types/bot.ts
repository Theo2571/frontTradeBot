export type BotStatusValue = 'running' | 'stopped' | 'error'

export interface BotConfig {
  apiKey: string
  apiSecret: string
  pair: string
  depositAmount: number
  gridRangePercent: number
  offsetPercent: number
  ordersCount: number
  volumeScalePercent: number
  gridShiftPercent: number
  takeProfitPercent: number
  isTestnet: boolean
}

export interface Order {
  id: string
  price: number
  amount: number
  total: number
  status: 'active' | 'executed' | 'cancelled'
  executedAt?: string
  profit?: number
}

export interface BotStatus {
  status: BotStatusValue
  currentPrice: number
  executedOrdersCount: number
  averagePrice: number
  activeSellOrder: { price: number; amount: number } | null
  totalProfit: number
  lastCycleProfit: number | null
  currentPnl: number
  cyclesCompleted: number
  activeOrders: Order[]
  executedOrders: Order[]
}

export type BotConfigFormValues = BotConfig
