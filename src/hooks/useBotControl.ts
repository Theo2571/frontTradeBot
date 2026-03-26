import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import i18n from '@/i18n/config'
import { startBot, stopBot } from '@/services/botService'
import { ApiError } from '@/services/api'
import { useBotStore } from '@/store/botStore'
import { useConfig } from './useConfig'
import type { BotConfig, BotStatus } from '@/types/bot'

export function useBotControl() {
  const queryClient = useQueryClient()
  const { saveConfig } = useConfig()
  const { closeStopDialog } = useBotStore()

  const startMutation = useMutation({
    mutationFn: (config: BotConfig) => startBot(config),
    onSuccess: (message, config) => {
      saveConfig(config)
      queryClient.setQueryData<BotStatus>(['botStatus'], (old) =>
        old ? { ...old, status: 'running' } : undefined,
      )
      queryClient.invalidateQueries({ queryKey: ['botStatus'] })
      toast.success(message || i18n.t('toast.startSuccess'))
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : i18n.t('toast.startError')
      toast.error(msg)
    },
  })

  const stopMutation = useMutation({
    mutationFn: stopBot,
    onSuccess: (message) => {
      closeStopDialog()
      queryClient.setQueryData<BotStatus>(['botStatus'], (old) =>
        old ? { ...old, status: 'stopped' } : undefined,
      )
      queryClient.invalidateQueries({ queryKey: ['botStatus'] })
      toast.success(message || i18n.t('toast.stopSuccess'))
    },
    onError: (error) => {
      closeStopDialog()
      const msg = error instanceof ApiError ? error.message : i18n.t('toast.stopError')
      toast.error(msg)
    },
  })

  return { startMutation, stopMutation }
}
