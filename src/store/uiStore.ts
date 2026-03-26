import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'
export type LocaleCode = 'en' | 'ru'

interface UiStore {
  theme: ThemeMode
  locale: LocaleCode
  setTheme: (theme: ThemeMode) => void
  setLocale: (locale: LocaleCode) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      locale: 'en',
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'front-trade-bot-ui',
      partialize: (s) => ({ theme: s.theme, locale: s.locale }),
    },
  ),
)
