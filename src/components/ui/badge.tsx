import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        running: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        stopped: 'bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:text-slate-400',
        error: 'bg-red-500/10 text-red-400 border border-red-500/20',
        testnet: 'bg-brand-accent/10 text-brand-accent border border-brand-accent/20',
        default: 'bg-brand-surface text-slate-700 border border-brand-border dark:text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-emerald-400 animate-pulse': variant === 'running',
            'bg-slate-400': variant === 'stopped',
            'bg-red-400 animate-pulse': variant === 'error',
            'bg-brand-accent': variant === 'testnet',
          })}
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
