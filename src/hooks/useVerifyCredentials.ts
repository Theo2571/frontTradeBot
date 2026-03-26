import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import i18n from '@/i18n/config'
import { verifyCredentials } from '@/services/botService'
import { ApiError } from '@/services/api'
import { useBotStore } from '@/store/botStore'
import { useConfig } from './useConfig'

export function useVerifyCredentials() {
  const queryClient = useQueryClient()
  const setExchangeCredentialsReady = useBotStore((s) => s.setExchangeCredentialsReady)
  const { loadConfig, saveConfig } = useConfig()

  return useMutation({
    mutationFn: verifyCredentials,
    onSuccess: (info, variables) => {
      setExchangeCredentialsReady(true)
      // Save apiKey so it persists across reloads (apiSecret is never saved)
      const existing = loadConfig()
      saveConfig({ ...existing, apiKey: variables.apiKey, apiSecret: '', isTestnet: variables.isTestnet } as any)
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['botStatus'] })
      toast.success(
        i18n.t('toast.verifySuccess', {
          type: info.accountType,
          trade: i18n.t(info.canTrade ? 'toast.tradeAllowed' : 'toast.tradeDenied'),
          n: info.nonZeroBalances,
        }),
      )
    },
    onError: (error) => {
      const msg = error instanceof ApiError ? error.message : i18n.t('toast.verifyError')
      toast.error(msg)
    },
  })
}
