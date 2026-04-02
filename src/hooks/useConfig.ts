import type { BotConfig } from '@/types/bot'

const STORAGE_KEY = 'dca_bot_config'

/**
 * Bump this number whenever BotConfig fields are added, removed, or renamed.
 * On mismatch the stored config is discarded rather than partially applied —
 * prevents hard-to-debug form state from a stale schema.
 */
const CONFIG_VERSION = 1

interface StoredConfig {
  version: number
  data: Partial<Omit<BotConfig, 'apiSecret'>>
}

export function useConfig() {
  const loadConfig = (): Partial<BotConfig> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return {}

      const stored = JSON.parse(raw) as StoredConfig

      // Discard if schema version doesn't match — prevents silent breakage
      if (stored.version !== CONFIG_VERSION) {
        localStorage.removeItem(STORAGE_KEY)
        return {}
      }

      return stored.data
    } catch {
      return {}
    }
  }

  const saveConfig = (config: BotConfig) => {
    // apiSecret is deliberately NOT persisted (security requirement)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { apiSecret: _secret, ...safeConfig } = config
    try {
      const stored: StoredConfig = { version: CONFIG_VERSION, data: safeConfig }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      // localStorage may be unavailable (private mode, storage quota exceeded)
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
