import { useQuery } from '@tanstack/react-query'
import { getBotStatus } from '@/services/botService'
import { useBotStore } from '@/store/botStore'

export function useBotStatus() {
  const exchangeCredentialsReady = useBotStore((s) => s.exchangeCredentialsReady)
  const selectedTradingPair = useBotStore((s) => s.selectedTradingPair)

  const query = useQuery({
    queryKey: ['botStatus', selectedTradingPair],
    queryFn: () => getBotStatus(selectedTradingPair),
    enabled: exchangeCredentialsReady,
    // Balance polls every 10s; status used to stop polling when bot was idle — then UI never
    // refreshed current price / snapshot. Poll while credentials are ready so data stays fresh.
    refetchInterval: (q) => {
      const status = q.state.data?.status
      if (status === 'running') return 2500
      if (status === 'error') return 5000
      return 10_000 // stopped (or first load): same cadence as useBalance
    },
    refetchIntervalInBackground: false,
    staleTime: 2000,
    retry: (failureCount) => failureCount < 3,
  })

  return {
    status: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    exchangeCredentialsReady,
  }
}
