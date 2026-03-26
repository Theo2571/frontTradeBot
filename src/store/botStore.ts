import { create } from 'zustand'

/** Persisted for the browser tab so /status & /balance refetch after F5 without wiping server state via re-verify */
const SESSION_CREDS_READY_KEY = 'front-trade-bot-creds-ready'

function readSessionCredentialsReady(): boolean {
  try {
    return sessionStorage.getItem(SESSION_CREDS_READY_KEY) === '1'
  } catch {
    return false
  }
}

interface BotStore {
  isStopDialogOpen: boolean
  activeTab: 'active' | 'executed'
  /** Set after successful «Войти» /verify-credentials; cleared when keys or Testnet change */
  exchangeCredentialsReady: boolean
  /** Selected trading pair from the form — drives GET /balance and /status ?pair= while idle */
  selectedTradingPair: string
  setSelectedTradingPair: (pair: string) => void
  setExchangeCredentialsReady: (ready: boolean) => void
  openStopDialog: () => void
  closeStopDialog: () => void
  setActiveTab: (tab: 'active' | 'executed') => void
}

export const useBotStore = create<BotStore>((set) => ({
  isStopDialogOpen: false,
  activeTab: 'active',
  exchangeCredentialsReady: readSessionCredentialsReady(),
  selectedTradingPair: 'BTCUSDT',
  setSelectedTradingPair: (pair) => set({ selectedTradingPair: pair }),
  setExchangeCredentialsReady: (ready) => {
    set({ exchangeCredentialsReady: ready })
    try {
      if (ready) sessionStorage.setItem(SESSION_CREDS_READY_KEY, '1')
      else sessionStorage.removeItem(SESSION_CREDS_READY_KEY)
    } catch {
      /* sessionStorage unavailable */
    }
  },
  openStopDialog: () => set({ isStopDialogOpen: true }),
  closeStopDialog: () => set({ isStopDialogOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
