import Link from 'next/link'

import type { Business, Location, PracticeArea } from '@/payload-types'
import { toKebabCase } from '@/utilities/toKebabCase'
import { formatFeeRange, getLanguageLabels } from './profile-helpers'

interface AtAGlanceSectionProps {
  firm: Business
  practiceAreas?: PracticeArea[]
  countrySlug: string
}

type GlanceItem = {
  label: string
  value: string
  href: string
}

type GlanceCard = {
  label: string
  items: GlanceItem[]
}

const buildHrefWithQuery = (
  pathname: string,
  params: Record<string, string | undefined>,
) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value)
  })
  const query = searchParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function AtAGlanceSection({ firm, practiceAreas = [], countrySlug }: AtAGlanceSectionProps) {
  const baseLawyersPath = `/${countrySlug}/lawyers`
  const languageLabels = getLanguageLabels(firm.languages)

  const hourlyFee = formatFeeRange({
    min: firm.hourlyFeeMin,
    max: firm.hourlyFeeMax,
    currency: firm.hourlyFeeCurrency || firm.feeCurrency,
  })
  const consultationFee = formatFeeRange({
    min: firm.feeRangeMin,
    max: firm.feeRangeMax,
    currency: firm.feeCurrency,
  })

  const practiceAreaById = new Map(
    practiceAreas.map((practiceArea) => [practiceArea.id, practiceArea]),
  )

  const locationItems = ((firm.locations || []) as Array<Location | number>)
    .filter((location): location is Location => typeof location === 'object')
    .map((location) => ({
      label: 'Service Areas',
      value: location.name,
      href: location.slug ? `${baseLawyersPath}/${location.slug}` : baseLawyersPath,
    }))

  const practiceAreaItems = practiceAreas.slice(0, 6).map((practiceArea) => ({
    label: 'Practice Areas',
    value: practiceArea.name,
    href: `${baseLawyersPath}/${practiceArea.slug}`,
  }))

  const serviceItems = (firm.practiceAreaDetails || [])
    .flatMap((detail) => {
      const practiceArea =
        typeof detail?.practiceArea === 'object'
          ? detail.practiceArea
          : detail?.practiceArea
            ? practiceAreaById.get(detail.practiceArea)
            : undefined

      return (detail?.services || []).map((service) => {
        const serviceName = service?.name || ''
        const serviceSlug = toKebabCase(serviceName)
        const href = practiceArea?.slug
          ? `${baseLawyersPath}/${practiceArea.slug}/${serviceSlug}`
          : buildHrefWithQuery(baseLawyersPath, { hasPricing: 'true' })

        return {
          label: 'Services Offered',
          value: serviceName,
          href,
        }
      })
    })
    .filter((item) => item.value)
    .slice(0, 8)

  const cards: GlanceCard[] = []

  if (hourlyFee) {
    cards.push({
      label: 'Hourly Fee',
      items: [
        {
          label: 'Hourly Fee',
          value: hourlyFee,
          href: buildHrefWithQuery(baseLawyersPath, { hasPricing: 'true' }),
        },
      ],
    })
  }

  if (consultationFee) {
    cards.push({
      label: 'Consultation Fee',
      items: [
        {
          label: 'Consultation Fee',
          value: consultationFee,
          href: buildHrefWithQuery(baseLawyersPath, { hasPricing: 'true' }),
        },
      ],
    })
  }

  if (firm.companySize) {
    cards.push({
      label: 'Company Size',
      items: [
        {
          label: 'Company Size',
          value: `${firm.companySize} employees`,
          href: buildHrefWithQuery(baseLawyersPath, { size: firm.companySize }),
        },
      ],
    })
  }

  if (languageLabels.length) {
    cards.push({
      label: 'Languages',
      items: languageLabels.map((language) => ({
        label: 'Languages',
        value: language,
        href: buildHrefWithQuery(baseLawyersPath, { languages: language }),
      })),
    })
  }

  if (practiceAreaItems.length) {
    cards.push({
      label: 'Practice Areas',
      items: practiceAreaItems,
    })
  }

  if (serviceItems.length) {
    cards.push({
      label: 'Services Offered',
      items: serviceItems,
    })
  }

  if (locationItems.length) {
    cards.push({
      label: 'Service Areas',
      items: locationItems,
    })
  }

  if (!cards.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">{firm.name} at a glance</h2>
      <div className="mt-5 rounded-xl border border-warm-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article key={card.label} className="rounded-lg border border-warm-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-royal-500">{card.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {card.items.map((item, index) => (
                  <Link
                    key={`${item.label}-${item.value}-${index}`}
                    href={item.href}
                    className="inline-flex items-center rounded-full border border-royal-200 bg-royal-50 px-2.5 py-1 text-xs font-medium text-royal-700 transition-colors hover:bg-royal-100 hover:text-royal-900"
                  >
                    {item.value}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
