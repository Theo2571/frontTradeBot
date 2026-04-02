import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/Layout/AppLayout'
import { ConfigForm } from '@/components/ConfigForm/ConfigForm'
import { StatusPanel } from '@/components/StatusPanel/StatusPanel'
import { OrdersTable } from '@/components/OrdersTable/OrdersTable'
import { StopBotDialog } from '@/components/StopBotDialog/StopBotDialog'
import { CandlestickChart } from '@/components/CandlestickChart'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useBotStore } from '@/store/botStore'
import { useUiStore } from '@/store/uiStore'

export default function App() {
  const selectedTradingPair = useBotStore((s) => s.selectedTradingPair)
  const theme = useUiStore((s) => s.theme)

  return (
    <TooltipProvider>
      <AppLayout>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(400px,460px)_1fr] gap-6 items-start">
          <ConfigForm />
          <div className="flex flex-col gap-4">
            <StatusPanel />
            <ErrorBoundary
              fallback={(e) => (
                <div className="flex items-center justify-center rounded-lg border border-brand-border p-8"
                     style={{ background: 'var(--brand-surface)', minHeight: '420px' }}>
                  <span className="text-sm text-[#f6465d]">
                    Chart error: {e.message}
                  </span>
                </div>
              )}
            >
              <CandlestickChart symbol={selectedTradingPair} theme={theme} />
            </ErrorBoundary>
            <OrdersTable />
          </div>
        </div>
        <StopBotDialog />
      </AppLayout>
    </TooltipProvider>
  )
}
