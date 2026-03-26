import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  message: string
  subtext?: string
  className?: string
}

export function EmptyState({ icon: Icon, message, subtext, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-border/50 mb-3">
        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-600" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-500">{message}</p>
      {subtext && <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">{subtext}</p>}
    </div>
  )
}
