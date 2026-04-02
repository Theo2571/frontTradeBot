import type { KlineInterval } from '@/services/binanceService'

const INTERVALS: KlineInterval[] = ['1m', '5m', '15m', '1h', '4h', '1d']

interface IntervalSelectorProps {
  value: KlineInterval
  onChange: (interval: KlineInterval) => void
}

/**
 * Compact interval tab row matching the app's Tailwind design system.
 * Active interval is highlighted with the brand-accent gold color.
 */
export function IntervalSelector({ value, onChange }: IntervalSelectorProps) {
  return (
    <div className="flex items-center gap-0.5">
      {INTERVALS.map((interval) => {
        const isActive = interval === value
        return (
          <button
            key={interval}
            onClick={() => onChange(interval)}
            className={[
              'px-2.5 py-1 rounded text-xs font-medium transition-colors',
              isActive
                ? 'bg-brand-accent/15 text-brand-accent'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--brand-border)]/40',
            ].join(' ')}
          >
            {interval}
          </button>
        )
      })}
    </div>
  )
}
