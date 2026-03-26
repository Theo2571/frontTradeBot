import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-brand-surface px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors',
          'dark:text-slate-100 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-1 focus:ring-brand-accent',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-brand-border hover:border-slate-400 dark:hover:border-slate-600',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
