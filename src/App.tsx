import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/Layout/AppLayout'
import { ConfigForm } from '@/components/ConfigForm/ConfigForm'
import { StatusPanel } from '@/components/StatusPanel/StatusPanel'
import { OrdersTable } from '@/components/OrdersTable/OrdersTable'
import { StopBotDialog } from '@/components/StopBotDialog/StopBotDialog'

export default function App() {
  return (
    <TooltipProvider>
      <AppLayout>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(400px,460px)_1fr] gap-6 items-start">
          <ConfigForm />
          <div className="flex flex-col gap-4">
            <StatusPanel />
            <OrdersTable />
          </div>
        </div>
        <StopBotDialog />
      </AppLayout>
    </TooltipProvider>
  )
}
