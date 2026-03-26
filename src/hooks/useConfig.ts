import type { BotConfig } from '@/types/bot'

const STORAGE_KEY = 'dca_bot_config'

export function useConfig() {
  const loadConfig = (): Partial<BotConfig> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return {}
      return JSON.parse(raw) as Partial<BotConfig>
    } catch {
      return {}
    }
  }

  const saveConfig = (config: BotConfig) => {
    // apiSecret is deliberately NOT persisted
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiSecret: _secret, ...safeConfig } = config
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeConfig))
    } catch {
      // localStorage may be unavailable (private mode, etc.)
    }
  }

  const clearConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // noop
    }
  }

  return { loadConfig, saveConfig, clearConfig }
}
