import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Play, Square, Settings, TrendingUp, KeyRound, LogIn, Loader2, CheckCircle2 } from 'lucide-react'
import {
  createBotConfigSchema,
  TRADING_PAIR_VALUES,
  type BotConfigFormValues,
  type TradingPairValue,
} from '@/lib/schemas'
import { useConfig } from '@/hooks/useConfig'
import { useBotStatus } from '@/hooks/useBotStatus'
import { useBotControl } from '@/hooks/useBotControl'
import { useBotStore } from '@/store/botStore'
import { useBalance } from '@/hooks/useBalance'
import { useVerifyCredentials } from '@/hooks/useVerifyCredentials'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from './FormField'
import { CryptoIcon } from '@/components/ui/CryptoIcon'
import { cn } from '@/lib/utils'

const PAIR_LABELS: Record<(typeof TRADING_PAIR_VALUES)[number], string> = {
  BTCUSDT: 'BTC / USDT',
  ETHUSDT: 'ETH / USDT',
}

/** Base asset extracted from pair symbol, used to pick the coin icon. */
const PAIR_BASE: Record<(typeof TRADING_PAIR_VALUES)[number], string> = {
  BTCUSDT: 'BTC',
  ETHUSDT: 'ETH',
}

const NumberInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    prefix?: string
    suffix?: string
    error?: string
  }
>(function NumberInput({ prefix, suffix, ...props }, ref) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm text-slate-500 pointer-events-none select-none dark:text-slate-500">
          {prefix}
        </span>
      )}
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        className={prefix ? 'pl-7' : suffix ? 'pr-8' : ''}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3 text-sm text-slate-500 pointer-events-none select-none dark:text-slate-500">
          {suffix}
        </span>
      )}
    </div>
  )
})
NumberInput.displayName = 'NumberInput'

export function ConfigForm() {
  const { t, i18n } = useTranslation()
  const { loadConfig } = useConfig()
  const { status } = useBotStatus()
  const { startMutation } = useBotControl()
  const {
    openStopDialog,
    setExchangeCredentialsReady,
    exchangeCredentialsReady,
    setSelectedTradingPair,
  } = useBotStore()
  const { balanceData } = useBalance()
  const verifyMutation = useVerifyCredentials()
  const [showSecret, setShowSecret] = useState(false)

  const quoteFree = balanceData?.quoteFree ?? null

  const savedConfig = loadConfig()
  const isRunning = status?.status === 'running'
  const inputsLocked = isRunning || startMutation.isPending

  const initialPair: TradingPairValue = TRADING_PAIR_VALUES.includes(
    savedConfig.pair as TradingPairValue,
  )
    ? (savedConfig.pair as TradingPairValue)
    : 'BTCUSDT'

  const botConfigSchema = useMemo(() => createBotConfigSchema(t), [t, i18n.language])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BotConfigFormValues>({
    resolver: zodResolver(botConfigSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      apiKey: savedConfig.apiKey ?? '',
      apiSecret: '',
      pair: initialPair,
      depositAmount: savedConfig.depositAmount ?? 100,
      gridRangePercent: savedConfig.gridRangePercent ?? 5,
      offsetPercent: savedConfig.offsetPercent ?? 0,
      ordersCount: savedConfig.ordersCount ?? 10,
      volumeScalePercent: savedConfig.volumeScalePercent ?? 0,
      gridShiftPercent: savedConfig.gridShiftPercent ?? 1,
      takeProfitPercent: savedConfig.takeProfitPercent ?? 1,
      isTestnet: savedConfig.isTestnet ?? true,
    },
  })

  const isTestnet = watch('isTestnet')
  const apiKeyWatch = watch('apiKey')
  const apiSecretWatch = watch('apiSecret')
  const pairWatch = watch('pair')

  useEffect(() => {
    if (pairWatch) setSelectedTradingPair(pairWatch as string)
  }, [pairWatch, setSelectedTradingPair])

  useEffect(() => {
    setExchangeCredentialsReady(false)
  }, [apiKeyWatch, apiSecretWatch, isTestnet, setExchangeCredentialsReady])

  const onLogin = () => {
    const v = getValues()
    verifyMutation.mutate({
      apiKey: v.apiKey.trim(),
      apiSecret: v.apiSecret.trim(),
      isTestnet: v.isTestnet,
    })
  }

  const canTryLogin =
    apiKeyWatch.trim().length > 0 && apiSecretWatch.trim().length > 0

  const onSubmit = handleSubmit(async (values) => {
    await startMutation.mutateAsync(values)
  })

  const fmtUsdt =
    quoteFree != null
      ? new Intl.NumberFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(quoteFree)
      : null

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 normal-case tracking-normal">
            <KeyRound className="h-3.5 w-3.5" />
            {t('credentials.sectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label={t('credentials.apiKey')}
            error={errors.apiKey?.message}
            required
            htmlFor="apiKey"
          >
            <Input
              id="apiKey"
              type="text"
              placeholder={t('credentials.apiKeyPlaceholder')}
              error={errors.apiKey?.message}
              autoComplete="off"
              {...register('apiKey', { disabled: inputsLocked })}
            />
          </FormField>

          <FormField
            label={t('credentials.apiSecret')}
            error={errors.apiSecret?.message}
            required
            htmlFor="apiSecret"
            hint={t('credentials.hintNotSaved')}
          >
            <div className="relative">
              <Input
                id="apiSecret"
                type={showSecret ? 'text' : 'password'}
                placeholder={t('credentials.apiSecretPlaceholder')}
                error={errors.apiSecret?.message}
                autoComplete="new-password"
                className="pr-10"
                {...register('apiSecret', { disabled: inputsLocked })}
              />
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                disabled={inputsLocked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors dark:hover:text-slate-300 disabled:pointer-events-none disabled:opacity-50"
                tabIndex={-1}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>

          <div className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-bg/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-300">
                {t('credentials.testnetTitle')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTestnet ? t('credentials.testnetHintOn') : t('credentials.testnetHintOff')}
              </p>
            </div>
            <Switch
              checked={isTestnet}
              disabled={inputsLocked}
              onCheckedChange={(checked) => setValue('isTestnet', checked)}
            />
          </div>

          {!isTestnet && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2">
              <p className="text-xs text-red-600 dark:text-red-400">{t('credentials.mainnetWarning')}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto gap-2 border-brand-border"
              disabled={!canTryLogin || verifyMutation.isPending || inputsLocked}
              onClick={onLogin}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {verifyMutation.isPending ? t('credentials.verifying') : t('credentials.login')}
            </Button>
            {exchangeCredentialsReady && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400/90">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{t('credentials.verifiedHint')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 normal-case tracking-normal">
            <TrendingUp className="h-3.5 w-3.5" />
            {t('pair.sectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FormField
            label={t('pair.label')}
            error={errors.pair?.message}
            required
            hint={t('pair.hint')}
          >
            <Select
              value={pairWatch}
              disabled={inputsLocked}
              onValueChange={(val) => setValue('pair', val as TradingPairValue, { shouldValidate: true })}
            >
              <SelectTrigger
                className={cn(
                  errors.pair ? 'border-red-500 focus:ring-red-500' : '',
                )}
              >
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <CryptoIcon
                      asset={PAIR_BASE[pairWatch as (typeof TRADING_PAIR_VALUES)[number]] ?? 'BTC'}
                      size={18}
                    />
                    {PAIR_LABELS[pairWatch as (typeof TRADING_PAIR_VALUES)[number]] ?? pairWatch}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TRADING_PAIR_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    <CryptoIcon asset={PAIR_BASE[value]} size={18} />
                    {PAIR_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 normal-case tracking-normal">
            <Settings className="h-3.5 w-3.5" />
            {t('grid.sectionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label={t('grid.depositAmount')}
              error={errors.depositAmount?.message}
              required
              htmlFor="depositAmount"
              hint={fmtUsdt != null ? t('grid.availableHint', { amount: fmtUsdt }) : undefined}
            >
              <NumberInput
                id="depositAmount"
                prefix="$"
                placeholder="100"
                error={errors.depositAmount?.message}
                {...register('depositAmount', {
                  disabled: inputsLocked,
                  validate: (v) => {
                    if (quoteFree == null) return true
                    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'))
                    if (isNaN(n)) return true
                    return (
                      n <= quoteFree ||
                      t('validation.depositExceeds', { amount: quoteFree.toFixed(2) })
                    )
                  },
                })}
              />
            </FormField>

            <FormField
              label={t('grid.ordersCount')}
              error={errors.ordersCount?.message}
              required
              htmlFor="ordersCount"
            >
              <NumberInput
                id="ordersCount"
                placeholder="10"
                error={errors.ordersCount?.message}
                {...register('ordersCount', { disabled: inputsLocked })}
              />
            </FormField>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label={t('grid.gridRange')}
              error={errors.gridRangePercent?.message}
              required
              htmlFor="gridRangePercent"
              hint={t('grid.hintRange')}
            >
              <NumberInput
                id="gridRangePercent"
                suffix="%"
                placeholder="5"
                step="0.1"
                error={errors.gridRangePercent?.message}
                {...register('gridRangePercent', { disabled: inputsLocked })}
              />
            </FormField>

            <FormField
              label={t('grid.offset')}
              error={errors.offsetPercent?.message}
              required
              htmlFor="offsetPercent"
              hint={t('grid.hintOffset')}
            >
              <NumberInput
                id="offsetPercent"
                suffix="%"
                placeholder="0"
                step="0.1"
                error={errors.offsetPercent?.message}
                {...register('offsetPercent', { disabled: inputsLocked })}
              />
            </FormField>

            <FormField
              label={t('grid.volumeScale')}
              error={errors.volumeScalePercent?.message}
              required
              htmlFor="volumeScalePercent"
              hint={t('grid.hintVolume')}
            >
              <NumberInput
                id="volumeScalePercent"
                suffix="%"
                placeholder="0"
                step="1"
                error={errors.volumeScalePercent?.message}
                {...register('volumeScalePercent', { disabled: inputsLocked })}
              />
            </FormField>

            <FormField
              label={t('grid.gridShift')}
              error={errors.gridShiftPercent?.message}
              required
              htmlFor="gridShiftPercent"
              hint={t('grid.hintShift')}
            >
              <NumberInput
                id="gridShiftPercent"
                suffix="%"
                placeholder="0"
                step="0.1"
                error={errors.gridShiftPercent?.message}
                {...register('gridShiftPercent', { disabled: inputsLocked })}
              />
            </FormField>
          </div>

          <FormField
            label={t('grid.takeProfit')}
            error={errors.takeProfitPercent?.message}
            required
            htmlFor="takeProfitPercent"
            hint={t('grid.hintTp')}
          >
            <NumberInput
              id="takeProfitPercent"
              suffix="%"
              placeholder="1"
              step="0.01"
              error={errors.takeProfitPercent?.message}
              {...register('takeProfitPercent', { disabled: inputsLocked })}
            />
          </FormField>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={inputsLocked || !exchangeCredentialsReady}
          title={!exchangeCredentialsReady ? t('credentials.startDisabledTitle') : undefined}
          isLoading={startMutation.isPending}
          size="lg"
        >
          {!startMutation.isPending && <Play className="h-4 w-4" />}
          {startMutation.isPending ? t('actions.starting') : t('actions.startBot')}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          disabled={!isRunning}
          onClick={openStopDialog}
        >
          <Square className="h-4 w-4" />
          {t('actions.stopBot')}
        </Button>
      </div>
    </form>
  )
}
