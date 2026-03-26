import type { TFunction } from 'i18next'
import { z } from 'zod'

/** Spot pairs available in the UI (Binance symbol, no slash). */
export const TRADING_PAIR_VALUES = ['BTCUSDT', 'ETHUSDT'] as const
export type TradingPairValue = (typeof TRADING_PAIR_VALUES)[number]

// Converts string input to number, handles comma decimals and stray currency symbols (e.g. "$ 12" from paste)
function toNumber(v: unknown): unknown {
  if (v === '' || v === null || v === undefined) return undefined
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined
  const cleaned = String(v)
    .trim()
    .replace(/[$€£\s]/g, '')
    .replace(',', '.')
  if (cleaned === '' || cleaned === '-') return undefined
  const n = Number(cleaned)
  return isNaN(n) ? undefined : n
}

function numField(schema: z.ZodNumber) {
  return z.preprocess(toNumber, schema)
}

export function createBotConfigSchema(t: TFunction) {
  return z.object({
    apiKey: z
      .string()
      .min(1, t('validation.apiKeyRequired'))
      .min(10, t('validation.apiKeyShort')),
    apiSecret: z
      .string()
      .min(1, t('validation.apiSecretRequired'))
      .min(10, t('validation.apiSecretShort')),
    pair: z.enum(TRADING_PAIR_VALUES, {
      required_error: t('validation.selectPair'),
      invalid_type_error: t('validation.selectPair'),
    }),
    depositAmount: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .positive(t('validation.positive')),
    ),
    gridRangePercent: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .min(0.1, t('validation.gridMin'))
        .max(100, t('validation.gridMax')),
    ),
    offsetPercent: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .min(0, t('validation.offsetMin'))
        .max(50, t('validation.offsetMax')),
    ),
    ordersCount: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .int(t('validation.wholeNumber'))
        .min(2, t('validation.ordersMin'))
        .max(100, t('validation.ordersMax')),
    ),
    volumeScalePercent: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .min(0, t('validation.volMin'))
        .max(400, t('validation.volMax')),
    ),
    gridShiftPercent: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .min(0, t('validation.shiftMin'))
        .max(50, t('validation.shiftMax')),
    ),
    takeProfitPercent: numField(
      z
        .number({ required_error: t('validation.required'), invalid_type_error: t('validation.mustBeNumber') })
        .min(0.01, t('validation.tpMin'))
        .max(100, t('validation.tpMax')),
    ),
    isTestnet: z.boolean(),
  })
}

export type BotConfigFormValues = z.infer<ReturnType<typeof createBotConfigSchema>>
