import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

type LocaleCode = 'en' | 'ru'

function readPersistedLocale(): LocaleCode {
  try {
    const raw = localStorage.getItem('front-trade-bot-ui')
    if (!raw) return 'en'
    const p = JSON.parse(raw) as { state?: { locale?: LocaleCode } }
    return p.state?.locale === 'ru' ? 'ru' : 'en'
  } catch {
    return 'en'
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: readPersistedLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
