import { useQuery } from '@tanstack/react-query'
import { getBalance } from '@/services/botService'
import { useBotStore } from '@/store/botStore'

export function useBalance() {
  const exchangeCredentialsReady = useBotStore((s) => s.exchangeCredentialsReady)
  const selectedTradingPair = useBotStore((s) => s.selectedTradingPair)

  const query = useQuery({
    queryKey: ['balance', selectedTradingPair],
    queryFn: () => getBalance(selectedTradingPair),
    enabled: exchangeCredentialsReady,
    // Poll every 10s — balance changes less often than price
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    staleTime: 8_000,
    retry: 2,
  })

  const data = query.data

  return {
    balances: data?.balances ?? [],
    pair: data?.pair ?? '',
    balanceData: data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    exchangeCredentialsReady,
  }
}
