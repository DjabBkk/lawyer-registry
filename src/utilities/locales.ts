export type LocaleCode = 'en' | 'th' | 'zh'
export type LocalePrefix = 'th' | 'zh'

export type Locale = {
  code: LocaleCode
  label: string
  englishLabel: string
  prefix: LocalePrefix | null
  isDefault: boolean
  hreflang: LocaleCode
  payloadLocale: LocaleCode
}

export const LOCALES: Locale[] = [
  {
    code: 'en',
    label: 'English',
    englishLabel: 'English',
    prefix: null,
    isDefault: true,
    hreflang: 'en',
    payloadLocale: 'en',
  },
  {
    code: 'th',
    label: 'ภาษาไทย',
    englishLabel: 'Thai',
    prefix: 'th',
    isDefault: false,
    hreflang: 'th',
    payloadLocale: 'th',
  },
  {
    code: 'zh',
    label: '中文',
    englishLabel: 'Mandarin',
    prefix: 'zh',
    isDefault: false,
    hreflang: 'zh',
    payloadLocale: 'zh',
  },
]

export const DEFAULT_LOCALE = LOCALES[0]

export function getLocaleByCode(code: string): Locale {
  return LOCALES.find((locale) => locale.code === code) || DEFAULT_LOCALE
}

export function getLocaleByPrefix(prefix: string | null): Locale {
  if (prefix === null) {
    return DEFAULT_LOCALE
  }

  return LOCALES.find((locale) => locale.prefix === prefix) || DEFAULT_LOCALE
}

export function isValidLocalePrefix(prefix: string): boolean {
  return LOCALES.some((locale) => locale.prefix === prefix && !locale.isDefault)
}

type AlternateUrl = {
  hreflang: Locale['hreflang']
  href: string
}

const normalizePath = (path: string): string => {
  if (!path) {
    return '/'
  }

  const prefixedPath = path.startsWith('/') ? path : `/${path}`

  if (prefixedPath === '/') {
    return prefixedPath
  }

  return prefixedPath.endsWith('/') ? prefixedPath : `${prefixedPath}/`
}

export function getAlternateUrls(path: string): AlternateUrl[] {
  const normalizedPath = normalizePath(path)

  return LOCALES.map((locale) => {
    if (locale.isDefault) {
      return {
        hreflang: locale.hreflang,
        href: normalizedPath,
      }
    }

    return {
      hreflang: locale.hreflang,
      href: normalizedPath === '/' ? `/${locale.prefix}/` : `/${locale.prefix}${normalizedPath}`,
    }
  })
}
