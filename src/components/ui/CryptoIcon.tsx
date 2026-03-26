/**
 * Inline SVG icons for the three supported crypto assets.
 * No external dependencies — paths are embedded directly.
 */

interface IconProps {
  size?: number
  className?: string
}

export function BtcIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#ffffff"
        d="M19.29 13.37c.23-1.58-.96-2.43-2.6-2.99l.53-2.13-1.3-.32-.52 2.07c-.34-.09-.69-.17-1.04-.24l.52-2.09-1.3-.32-.53 2.12c-.28-.07-.56-.13-.83-.2v-.01l-1.8-.45-.35 1.39s.96.22.94.23c.53.13.62.49.61.77l-.62 2.47c.04.01.08.02.14.04l-.14-.04-.87 3.47c-.07.16-.23.4-.6.31.01.01-.94-.24-.94-.24l-.64 1.49 1.69.42c.32.08.63.16.94.24l-.54 2.16 1.3.33.53-2.14c.35.1.7.18 1.04.27l-.53 2.13 1.3.32.54-2.16c2.21.42 3.87.25 4.57-1.75.56-1.61-.03-2.54-1.19-3.14.85-.2 1.49-.76 1.66-1.92zm-2.97 4.16c-.4 1.61-3.12.74-4 .52l.71-2.86c.88.22 3.71.66 3.29 2.34zm.4-4.19c-.36 1.46-2.61.72-3.34.54l.65-2.6c.73.18 3.07.52 2.69 2.06z"
      />
    </svg>
  )
}

export function EthIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#ffffff">
        <path fillOpacity={0.9} d="M16.498 4v8.87l7.497 3.35L16.498 4z" />
        <path d="M16.498 4L9 16.22l7.498-3.35V4z" />
        <path fillOpacity={0.9} d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" />
        <path d="M16.498 27.995v-6.028L9 17.616l7.498 4.379z" />
        <path fillOpacity={0.7} d="M16.498 20.573l7.497-4.353-7.497-3.348v7.7z" />
        <path fillOpacity={0.5} d="M9 16.22l7.498 4.353v-7.701L9 16.22z" />
      </g>
    </svg>
  )
}

export function UsdtIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        fill="#ffffff"
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.666 0-.817 2.902-1.493 6.79-1.666v2.66c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.659c3.88.173 6.775.85 6.775 1.664 0 .815-2.895 1.491-6.775 1.665zm0-3.59v-2.366h5.414V8.82H8.578v2.607h5.414v2.365c-4.4.202-7.708 1.074-7.708 2.128 0 1.053 3.308 1.926 7.708 2.127v7.617h3.93v-7.622c4.393-.2 7.694-1.073 7.694-2.122 0-1.05-3.301-1.92-7.694-2.127z"
      />
    </svg>
  )
}

/** Returns the right icon for BTC, ETH or USDT. Falls back to a generic circle. */
export function CryptoIcon({
  asset,
  size = 28,
  className,
}: {
  asset: string
  size?: number
  className?: string
}) {
  const upper = asset.toUpperCase()
  if (upper === 'BTC') return <BtcIcon size={size} className={className} />
  if (upper === 'ETH') return <EthIcon size={size} className={className} />
  if (upper === 'USDT' || upper === 'USDC' || upper === 'BUSD')
    return <UsdtIcon size={size} className={className} />

  // Generic fallback — first two letters on a neutral circle
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="16" fill="#475569" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="system-ui, sans-serif"
      >
        {upper.slice(0, 2)}
      </text>
    </svg>
  )
}
