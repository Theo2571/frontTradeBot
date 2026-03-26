import { ListOrdered, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Order } from '@/types/bot'
import { formatPrice, formatAmount, formatDate, cn } from '@/lib/utils'
import { EmptyState } from './EmptyState'

function StatusPill({ status }: { status: Order['status'] }) {
  const { t } = useTranslation()
  const label =
    status === 'active'
      ? t('orders.statusActive')
      : status === 'executed'
        ? t('orders.statusExecuted')
        : t('orders.statusCancelled')
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', {
        'bg-blue-500/10 text-blue-600 dark:text-blue-400': status === 'active',
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': status === 'executed',
        'bg-slate-500/10 text-slate-600 dark:text-slate-500': status === 'cancelled',
      })}
    >
      {label}
    </span>
  )
}

function ProfitCell({ profit }: { profit?: number | null }) {
  if (profit == null) return <span className="text-slate-500 dark:text-slate-600">—</span>
  return (
    <span
      className={cn('font-medium', {
        'text-emerald-600 dark:text-emerald-400': profit > 0,
        'text-red-600 dark:text-red-400': profit < 0,
        'text-slate-500 dark:text-slate-400': profit === 0,
      })}
    >
      {profit >= 0 ? '+' : ''}
      {formatPrice(profit)}
    </span>
  )
}

interface ActiveOrdersTableProps {
  orders: Order[]
}

export function ActiveOrdersTable({ orders }: ActiveOrdersTableProps) {
  const { t } = useTranslation()

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ListOrdered}
        message={t('orders.noActive')}
        subtext={t('orders.noActiveSub')}
      />
    )
  }

  return (
    <>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colPrice')}
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colAmount')}
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colTotal')}
              </th>
              <th className="text-center py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colStatus')}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors"
              >
                <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                  {formatPrice(order.price)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {formatAmount(order.amount)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {formatPrice(order.total)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <StatusPill status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col divide-y divide-brand-border/50">
        {orders.map((order) => (
          <div key={order.id} className="py-3 px-1 flex justify-between items-start">
            <div>
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {formatPrice(order.price)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatAmount(order.amount)} {t('orders.units')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{formatPrice(order.total)}</p>
              <StatusPill status={order.status} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

interface ExecutedOrdersTableProps {
  orders: Order[]
}

export function ExecutedOrdersTable({ orders }: ExecutedOrdersTableProps) {
  const { t } = useTranslation()

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        message={t('orders.noExecuted')}
        subtext={t('orders.noExecutedSub')}
      />
    )
  }

  return (
    <>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              <th className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colPrice')}
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colAmount')}
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colTotal')}
              </th>
              <th className="text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colExecutedAt')}
              </th>
              <th className="text-right py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {t('orders.colProfit')}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-brand-border/50 hover:bg-brand-border/20 transition-colors"
              >
                <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                  {formatPrice(order.price)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {formatAmount(order.amount)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                  {formatPrice(order.total)}
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-500 text-xs">
                  {order.executedAt ? formatDate(order.executedAt) : '—'}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <ProfitCell profit={order.profit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col divide-y divide-brand-border/50">
        {orders.map((order) => (
          <div key={order.id} className="py-3 px-1">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                {formatPrice(order.price)}
              </p>
              <ProfitCell profit={order.profit} />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                {formatAmount(order.amount)} {t('orders.units')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-600">
                {order.executedAt ? formatDate(order.executedAt) : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
