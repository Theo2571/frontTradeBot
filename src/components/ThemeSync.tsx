import { useEffect } from 'react'
import i18n from '@/i18n/config'
import { useUiStore } from '@/store/uiStore'

/** Syncs persisted locale/theme to document and i18n. */
export function ThemeSync() {
  const theme = useUiStore((s) => s.theme)
  const locale = useUiStore((s) => s.locale)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale === 'ru' ? 'ru' : 'en'
  }, [locale])

  return null
}
