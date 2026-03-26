import { Activity, Wifi, WifiOff, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBotStatus } from '@/hooks/useBotStatus'
import { useUiStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { status, isError } = useBotStatus()
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const locale = useUiStore((s) => s.locale)
  const setLocale = useUiStore((s) => s.setLocale)

  const botStatus = status?.status ?? 'stopped'
  const activeCount = status?.activeOrders?.length ?? 0

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border backdrop-blur-md bg-brand-bg/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 border border-brand-accent/20">
              <Activity className="h-4 w-4 text-brand-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {t('app.title')}
              </h1>
              <p className="text-xs text-slate-500 leading-tight truncate">{t('app.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
            <div className="flex rounded-lg border border-brand-border p-0.5 bg-brand-surface/50">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] font-semibold transition-colors',
                  locale === 'en'
                    ? 'bg-brand-accent/15 text-brand-accent'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300',
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('ru')}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] font-semibold transition-colors',
                  locale === 'ru'
                    ? 'bg-brand-accent/15 text-brand-accent'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300',
                )}
              >
                RU
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
              aria-label={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {status?.status === 'running' && activeCount > 0 && (
              <Badge variant="testnet" dot={false} className="inline-flex max-sm:text-[10px] max-sm:px-1.5">
                {t('header.activeOrders', { count: activeCount })}
              </Badge>
            )}

            {isError && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                <WifiOff className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('header.noConnection')}</span>
              </div>
            )}

            {!isError && status && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Wifi className="h-3.5 w-3.5" />
              </div>
            )}

            {botStatus === 'running' && (
              <Badge variant="running">{t('header.badgeRunning')}</Badge>
            )}
            {botStatus === 'stopped' && (
              <Badge variant="stopped">{t('header.badgeStopped')}</Badge>
            )}
            {botStatus === 'error' && <Badge variant="error">{t('header.badgeError')}</Badge>}
          </div>
        </div>
      </div>
    </header>
  )
}
