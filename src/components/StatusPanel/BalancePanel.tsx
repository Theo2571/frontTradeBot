import { Wallet, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBalance } from '@/hooks/useBalance'
import { Card, CardContent } from '@/components/ui/card'
import { CryptoIcon } from '@/components/ui/CryptoIcon'
import { formatAmount } from '@/lib/utils'

function BalanceRow({
  asset,
  free,
  locked,
  isUsd,
  lockedLabel,
  freeLabel,
}: {
  asset: string
  free: number
  locked: number
  isUsd: boolean
  lockedLabel: string
  freeLabel: string
}) {
  const total = free + locked

  const formatValue = (v: number) =>
    isUsd
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(v)
      : formatAmount(v)

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-brand-border/50 last:border-0">
      <div className="flex items-center gap-2.5">
        <CryptoIcon asset={asset} size={28} />
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{asset}</p>
          {locked > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-600">
              {formatValue(locked)} {lockedLabel}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatValue(total)}</p>
        <p className="text-xs text-slate-500">
          {formatValue(free)} {freeLabel}
        </p>
      </div>
    </div>
  )
}

const USD_LIKE = new Set(['USDT', 'USDC', 'BUSD', 'TUSD', 'DAI'])

export function BalancePanel() {
  const { t, i18n } = useTranslation()
  const {
    balances,
    pair,
    isLoading,
    isFetching,
    isError,
    balanceData,
    exchangeCredentialsReady,
  } = useBalance()

  const timeLocale = i18n.language === 'ru' ? 'ru-RU' : 'en-US'

  if (!exchangeCredentialsReady) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t('balance.title')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-600 py-3 text-center">
            {t('balance.loginPrompt')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('balance.title')}
              </span>
              {pair && <span className="text-xs text-slate-500 dark:text-slate-600">· {pair}</span>}
            </div>
            {balanceData != null && (
              <p className="text-[11px] text-slate-500 pl-5">
                {t('balance.availableForGrid')}{' '}
                <span className="text-slate-700 font-medium tabular-nums dark:text-slate-300">
                  {new Intl.NumberFormat(timeLocale, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8,
                  }).format(balanceData.quoteFree)}{' '}
                  {balanceData.quoteAsset}
                </span>
                {balanceData.updatedAt && (
                  <span className="text-slate-400 ml-1 dark:text-slate-600">
                    · {new Date(balanceData.updatedAt).toLocaleTimeString(timeLocale)}
                  </span>
                )}
              </p>
            )}
          </div>
          {isFetching && !isLoading && (
            <RefreshCw className="h-3 w-3 text-slate-500 animate-spin dark:text-slate-600" />
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 bg-brand-border rounded animate-pulse" />
            <div className="h-10 bg-brand-border rounded animate-pulse w-4/5" />
          </div>
        ) : isError ? (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-600">{t('balance.loadError')}</p>
          </div>
        ) : balances.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-600">{t('balance.empty')}</p>
          </div>
        ) : (
          <div>
            {balances.map((b) => (
              <BalanceRow
                key={b.asset}
                asset={b.asset}
                free={b.free}
                locked={b.locked}
                isUsd={USD_LIKE.has(b.asset)}
                lockedLabel={t('balance.locked')}
                freeLabel={t('balance.free')}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
