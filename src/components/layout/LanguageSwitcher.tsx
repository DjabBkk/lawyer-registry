'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { DEFAULT_LOCALE, getAlternateUrls, getLocaleByCode, isValidLocalePrefix } from '@/utilities/locales'

export function LanguageSwitcher() {
  const pathname = usePathname() || '/'
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0] || ''
  const hasLocalePrefix = isValidLocalePrefix(firstSegment)
  const currentLocaleCode = hasLocalePrefix ? firstSegment : DEFAULT_LOCALE.code
  const pathWithoutLocale = hasLocalePrefix ? `/${pathSegments.slice(1).join('/')}` : pathname

  const alternateLinks = getAlternateUrls(pathWithoutLocale)
    .filter((alternate) => alternate.hreflang !== currentLocaleCode)
    .map((alternate) => {
      const locale = getLocaleByCode(alternate.hreflang)

      return {
        href: alternate.href,
        label: locale.label,
        code: locale.code,
      }
    })

  if (!alternateLinks.length) {
    return null
  }

  return (
    <nav aria-label="Language Switcher">
      <ul className="flex items-center gap-3 text-sm">
        {alternateLinks.map((link) => (
          <li key={link.code}>
            <Link href={link.href} className="text-royal-700 hover:text-royal-900">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
