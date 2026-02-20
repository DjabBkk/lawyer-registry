export const responseTimeLabelMap: Record<string, string> = {
  'within-1-hour': 'Responds within 1 hour',
  'within-24-hours': 'Responds within 24 hours',
  'within-48-hours': 'Responds within 48 hours',
  'within-1-week': 'Responds within 1 week',
}

export const responseTimeBadgeLabel = (value?: string | null) =>
  value ? responseTimeLabelMap[value] || value : null

export type CurrencyLike =
  | number
  | string
  | {
      code?: string | null
      symbol?: string | null
      symbolPosition?: string | null
    }
  | null
  | undefined

const currencySymbolByCode: Record<string, string> = {
  THB: '฿',
  USD: '$',
  EUR: '€',
  HKD: 'HK$',
  SGD: 'S$',
  GBP: '£',
}

const getCurrencyDisplay = (currency: CurrencyLike) => {
  if (currency && typeof currency === 'object') {
    const symbol = typeof currency.symbol === 'string' && currency.symbol ? currency.symbol : undefined
    const code = typeof currency.code === 'string' && currency.code ? currency.code : undefined
    const position = currency.symbolPosition === 'after' ? 'after' : 'before'

    if (symbol) {
      return { symbol, position }
    }

    if (code && currencySymbolByCode[code]) {
      return { symbol: currencySymbolByCode[code], position }
    }

    if (code) {
      return { symbol: `${code} `, position: 'before' as const }
    }
  }

  if (typeof currency === 'string' && currency) {
    if (currencySymbolByCode[currency]) {
      return { symbol: currencySymbolByCode[currency], position: 'before' as const }
    }

    return { symbol: `${currency} `, position: 'before' as const }
  }

  return { symbol: '฿', position: 'before' as const }
}

export const formatCurrencyAmount = (value: number, currency: CurrencyLike = 'THB') => {
  const display = getCurrencyDisplay(currency)
  const formattedValue = value.toLocaleString()

  if (display.position === 'after') {
    return `${formattedValue}${display.symbol}`
  }

  return `${display.symbol}${formattedValue}`
}

export const formatFeeRange = ({
  min,
  max,
  currency = 'THB',
}: {
  min?: number | null
  max?: number | null
  currency?: CurrencyLike
}) => {
  const resolvedCurrency = currency || 'THB'

  if (typeof min === 'number' && typeof max === 'number') {
    return `${formatCurrencyAmount(min, resolvedCurrency)} - ${formatCurrencyAmount(max, resolvedCurrency)}`
  }
  if (typeof min === 'number') {
    return `From ${formatCurrencyAmount(min, resolvedCurrency)}`
  }
  if (typeof max === 'number') {
    return `Up to ${formatCurrencyAmount(max, resolvedCurrency)}`
  }
  return null
}

export const getLanguageLabel = (language: unknown): string | null => {
  if (typeof language === 'string' && language) {
    return language
  }

  if (language && typeof language === 'object') {
    const languageObject = language as {
      name?: unknown
      nativeName?: unknown
      code?: unknown
    }

    if (typeof languageObject.name === 'string' && languageObject.name) {
      return languageObject.name
    }

    if (typeof languageObject.nativeName === 'string' && languageObject.nativeName) {
      return languageObject.nativeName
    }

    if (typeof languageObject.code === 'string' && languageObject.code) {
      return languageObject.code.toUpperCase()
    }
  }

  return null
}

export const getLanguageLabels = (languages: unknown): string[] => {
  if (!Array.isArray(languages)) {
    return []
  }

  return languages
    .map((language) => getLanguageLabel(language))
    .filter((label): label is string => Boolean(label))
}

export const isLeadTeamRole = (role?: string | null) =>
  role === 'Founding Partner' || role === 'Managing Partner'
