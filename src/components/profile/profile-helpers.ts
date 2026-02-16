export const responseTimeLabelMap: Record<string, string> = {
  'within-1-hour': 'Responds within 1 hour',
  'within-24-hours': 'Responds within 24 hours',
  'within-48-hours': 'Responds within 48 hours',
  'within-1-week': 'Responds within 1 week',
}

export const responseTimeBadgeLabel = (value?: string | null) =>
  value ? responseTimeLabelMap[value] || value : null

export const formatCurrencyAmount = (value: number, currency: string = 'THB') => {
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '฿'
  return `${symbol}${value.toLocaleString()}`
}

export const formatFeeRange = ({
  min,
  max,
  currency = 'THB',
}: {
  min?: number | null
  max?: number | null
  currency?: string | null
}) => {
  if (typeof min === 'number' && typeof max === 'number') {
    return `${formatCurrencyAmount(min, currency || 'THB')} - ${formatCurrencyAmount(max, currency || 'THB')}`
  }
  if (typeof min === 'number') {
    return `From ${formatCurrencyAmount(min, currency || 'THB')}`
  }
  if (typeof max === 'number') {
    return `Up to ${formatCurrencyAmount(max, currency || 'THB')}`
  }
  return null
}

export const isLeadTeamRole = (role?: string | null) =>
  role === 'Founding Partner' || role === 'Managing Partner'
