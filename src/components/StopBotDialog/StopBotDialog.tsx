import { Loader2, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBotStore } from '@/store/botStore'
import { useBotControl } from '@/hooks/useBotControl'
import { useBotStatus } from '@/hooks/useBotStatus'
import { formatProfit } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

export function StopBotDialog() {
  const { t } = useTranslation()
  const { isStopDialogOpen, closeStopDialog } = useBotStore()
  const { stopMutation } = useBotControl()
  const { status } = useBotStatus()

  const profit = status?.totalProfit ?? 0
  const n = status?.activeOrders?.length ?? 0

  return (
    <AlertDialog
      open={isStopDialogOpen}
      onOpenChange={(open) => {
        if (!open && !stopMutation.isPending) closeStopDialog()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <AlertDialogTitle>{t('stopDialog.title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <span className="block">{t('stopDialog.description')}</span>
            <span className="block font-medium text-slate-700 dark:text-slate-300">
              {t('stopDialog.currentPnl')}{' '}
              <span className={profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                {formatProfit(profit)}
              </span>
            </span>
            {n > 0 && (
              <span className="block text-amber-700 dark:text-amber-400/80">{t('stopDialog.cancelOrders', { count: n })}</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={stopMutation.isPending} onClick={closeStopDialog}>
            {t('stopDialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              stopMutation.mutate()
            }}
            disabled={stopMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white border-0 gap-2"
          >
            {stopMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {stopMutation.isPending ? t('stopDialog.stopping') : t('stopDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
