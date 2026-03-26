import { apiClient, ApiError } from './api'
import type {
  StartBotRequest,
  StartBotResponse,
  StopBotResponse,
  StatusResponse,
  BalanceResponse,
  BalanceData,
  VerifyCredentialsData,
  VerifyCredentialsResponse,
} from '@/types/api'
import type { BotStatus } from '@/types/bot'

// WARNING: Do not log the config object — it contains apiSecret
export async function startBot(config: StartBotRequest): Promise<string> {
  const { data } = await apiClient.post<StartBotResponse>('/start', config)
  return data.data.message
}

export async function stopBot(): Promise<string> {
  const { data } = await apiClient.post<StopBotResponse>('/stop')
  return data.data.message
}

export async function getBotStatus(pair?: string): Promise<BotStatus> {
  const { data } = await apiClient.get<StatusResponse>('/status', {
    params: pair ? { pair } : undefined,
  })
  return data.data
}

export async function getBalance(pair?: string): Promise<BalanceData> {
  const { data } = await apiClient.get<BalanceResponse>('/balance', {
    params: pair ? { pair } : undefined,
  })
  return data.data
}

export async function verifyCredentials(payload: {
  apiKey: string
  apiSecret: string
  isTestnet: boolean
}): Promise<VerifyCredentialsData> {
  const { data } = await apiClient.post<VerifyCredentialsResponse>('/verify-credentials', payload)
  if (!data.success || data.data == null) {
    throw new ApiError(400, data.error ?? 'Verification failed')
  }
  return data.data
}
