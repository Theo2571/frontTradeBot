import { Activity, DollarSign, BarChart2, ShoppingBag, TrendingUp, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBotStatus } from '@/hooks/useBotStatus'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from './StatCard'
import { BalancePanel } from './BalancePanel'
import { formatPrice, formatProfit, formatAmount, cn } from '@/lib/utils'
import type { BotStatusValue } from '@/types/bot'

function StatusBadge({ status }: { status: BotStatusValue | undefined }) {
  const { t } = useTranslation()
  if (!status || status === 'stopped') return <Badge variant="stopped">{t('status.badgeStopped')}</Badge>
  if (status === 'running') return <Badge variant="running">{t('status.badgeRunning')}</Badge>
  return <Badge variant="error">{t('status.badgeError')}</Badge>
}

export function StatusPanel() {
  const { t } = useTranslation()
  const { status, isLoading, isFetching, exchangeCredentialsReady } = useBotStatus()

  const showStatusLoading = exchangeCredentialsReady && isLoading

  const profit = status?.totalProfit ?? 0
  const currentPnl = status?.currentPnl ?? 0
  const lastCycleProfit = status?.lastCycleProfit ?? null
  const profitColor = (v: number) =>
    v > 0 ? 'text-emerald-600 dark:text-emerald-400' : v < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'

  return (
    <div className="flex flex-col gap-3">
      {!exchangeCredentialsReady && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-600 dark:text-slate-500">{t('status.loginPrompt')}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t('status.botStatus')}
          icon={Activity}
          isLoading={showStatusLoading}
          isFetching={exchangeCredentialsReady ? isFetching : false}
          value={<StatusBadge status={status?.status} />}
        />
        <StatCard
          label={t('status.currentPrice')}
          icon={DollarSign}
          isLoading={showStatusLoading}
          isFetching={exchangeCredentialsReady ? isFetching : false}
          value={status ? formatPrice(status.currentPrice, 2) : null}
        />
        <StatCard
          label={t('status.averagePrice')}
          icon={BarChart2}
          isLoading={showStatusLoading}
          isFetching={exchangeCredentialsReady ? isFetching : false}
          value={status ? formatPrice(status.averagePrice, 2) : null}
        />
        <StatCard
          label={t('status.executedOrders')}
          icon={ShoppingBag}
          isLoading={showStatusLoading}
          isFetching={exchangeCredentialsReady ? isFetching : false}
          value={status?.executedOrdersCount ?? '—'}
        />
        <StatCard
          label={t('status.cyclesCompleted')}
          icon={CheckCircle2}
          isLoading={showStatusLoading}
          isFetching={exchangeCredentialsReady ? isFetching : false}
          value={status?.cyclesCompleted ?? '—'}
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('status.totalProfit')}
            </span>
            <TrendingUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-600" />
          </div>
          {showStatusLoading ? (
            <div className="h-8 bg-brand-border rounded animate-pulse w-1/2" />
          ) : (
            <div className="flex flex-col gap-1">
              <div className={cn('text-2xl font-bold', profitColor(profit))}>{formatProfit(profit)}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{t('status.currentPnl')}</span>
                <span className={cn('text-xs font-medium tabular-nums', profitColor(currentPnl))}>
                  {status ? formatProfit(currentPnl) : '—'}
                </span>
              </div>
              {lastCycleProfit != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t('status.lastCycleProfit')}</span>
                  <span className={cn('text-xs font-medium tabular-nums', profitColor(lastCycleProfit))}>
                    {formatProfit(lastCycleProfit)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('status.activeSellOrder')}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 dark:text-slate-600" />
          </div>
          {showStatusLoading ? (
            <div className="h-6 bg-brand-border rounded animate-pulse w-2/3" />
          ) : status?.activeSellOrder ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('status.price')}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatPrice(status.activeSellOrder.price)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{t('status.amount')}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {formatAmount(status.activeSellOrder.amount)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-600 italic">{t('status.noActiveSell')}</p>
          )}
        </CardContent>
      </Card>

      <BalancePanel />
    </div>
  )
}
