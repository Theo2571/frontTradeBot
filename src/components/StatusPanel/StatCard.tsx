import { RefreshCw, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: React.ReactNode
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  isLoading?: boolean
  isFetching?: boolean
  className?: string
  valueClassName?: string
}

export function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
  isFetching,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-500">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {isFetching && !isLoading && (
              <RefreshCw className="h-3 w-3 text-slate-500 animate-spin dark:text-slate-600" />
            )}
            {Icon && <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-600" />}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-7 bg-brand-border rounded animate-pulse w-3/4" />
          </div>
        ) : (
          <div
            className={cn(
              'text-lg font-bold text-slate-900 truncate dark:text-slate-100',
              valueClassName,
            )}
          >
            {value ?? <span className="text-slate-500 dark:text-slate-600">—</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
