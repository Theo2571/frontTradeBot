import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  /** Content to render normally */
  children: ReactNode
  /**
   * Custom fallback UI. Receives the caught error so callers can show
   * context-specific messages (e.g. "Chart failed to load" vs "App crashed").
   */
  fallback?: (error: Error) => ReactNode
}

interface State {
  error: Error | null
}

/**
 * Class-based error boundary — the only way to catch render-phase errors in React.
 *
 * Usage:
 *   <ErrorBoundary fallback={(e) => <p>Chart error: {e.message}</p>}>
 *     <CandlestickChart ... />
 *   </ErrorBoundary>
 *
 * Without this, any uncaught exception inside a child unmounts the entire tree.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production replace with your error-reporting service (Sentry, Datadog, etc.)
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (error) {
      return this.props.fallback ? (
        this.props.fallback(error)
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-brand-border p-8 text-center"
             style={{ background: 'var(--brand-surface)' }}>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            Something went wrong
          </span>
          <span className="text-xs text-[var(--text-muted)]">{error.message}</span>
          <button
            onClick={() => this.setState({ error: null })}
            className="mt-2 rounded px-3 py-1 text-xs font-medium text-brand-accent hover:underline"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
