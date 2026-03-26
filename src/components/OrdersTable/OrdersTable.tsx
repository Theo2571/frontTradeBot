import { useTranslation } from 'react-i18next'
import { useBotStatus } from '@/hooks/useBotStatus'
import { useBotStore } from '@/store/botStore'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ActiveOrdersTable, ExecutedOrdersTable } from './OrdersTableContent'

export function OrdersTable() {
  const { t } = useTranslation()
  const { status } = useBotStatus()
  const { activeTab, setActiveTab } = useBotStore()

  const activeOrders = status?.activeOrders ?? []
  const executedOrders = status?.executedOrders ?? []

  const handleTabChange = (v: string) => setActiveTab(v as 'active' | 'executed')

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="normal-case tracking-normal">{t('orders.title')}</CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="px-4">
          <TabsTrigger value="active" activeValue={activeTab} onValueChange={handleTabChange}>
            {t('orders.activeBuy', { count: activeOrders.length })}
          </TabsTrigger>
          <TabsTrigger value="executed" activeValue={activeTab} onValueChange={handleTabChange}>
            {t('orders.executed', { count: executedOrders.length })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" activeValue={activeTab} className="p-0">
          <div className="px-4 pb-4">
            <ActiveOrdersTable orders={activeOrders} />
          </div>
        </TabsContent>

        <TabsContent value="executed" activeValue={activeTab} className="p-0">
          <div className="px-4 pb-4">
            <ExecutedOrdersTable orders={executedOrders} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
