import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  activeValue: string
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  activeValue: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child as React.ReactElement<{ activeValue?: string; onValueChange?: (v: string) => void }>, {
          activeValue: value,
          onValueChange,
        })
      })}
    </div>
  )
}

function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn('flex border-b border-brand-border', className)}
      {...props}
    />
  )
}

function TabsTrigger({ value, activeValue, onValueChange, className, children, ...props }: TabsTriggerProps & { onValueChange?: (v: string) => void }) {
  const isActive = value === activeValue
  return (
    <button
      type="button"
      onClick={() => onValueChange?.(value)}
      className={cn(
        'px-4 py-2.5 text-sm font-medium transition-all -mb-px',
        isActive
          ? 'border-b-2 border-brand-accent text-brand-accent'
          : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent dark:text-slate-400 dark:hover:text-slate-300',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, activeValue, className, children, ...props }: TabsContentProps) {
  if (value !== activeValue) return null
  return (
    <div className={cn('mt-0', className)} {...props}>
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
