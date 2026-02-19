'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BriefcaseBusiness, ChevronDown, ChevronUp } from 'lucide-react'

import type { Business, PracticeArea } from '@/payload-types'
import { formatCurrencyAmount } from './profile-helpers'

type DetailItem = NonNullable<Business['practiceAreaDetails']>[number]

interface ServicesAndFeesSectionProps {
  practiceAreaDetails?: Business['practiceAreaDetails']
  practiceAreas?: PracticeArea[]
  countrySlug: string
  hourlyFeeMin?: number | null
  hourlyFeeMax?: number | null
  hourlyFeeCurrency?: string | null
  hourlyFeeNote?: string | null
}

const formatAreaPrice = (detail: {
  priceMin?: number | null
  priceMax?: number | null
  priceCurrency?: string | null
  priceNote?: string | null
}) => {
  const currency = detail.priceCurrency || 'THB'
  let range = ''

  if (typeof detail.priceMin === 'number' && typeof detail.priceMax === 'number') {
    range = `${formatCurrencyAmount(detail.priceMin, currency)} - ${formatCurrencyAmount(detail.priceMax, currency)}`
  } else if (typeof detail.priceMin === 'number') {
    range = `From ${formatCurrencyAmount(detail.priceMin, currency)}`
  } else if (typeof detail.priceMax === 'number') {
    range = `Up to ${formatCurrencyAmount(detail.priceMax, currency)}`
  }

  if (!range) return ''
  return detail.priceNote ? `${range} ${detail.priceNote}` : range
}

const parsePriceNumber = (value?: string | null) => {
  if (!value) return null
  const matches = value.replace(/,/g, '').match(/\d+(?:\.\d+)?/g)
  if (!matches || !matches.length) return null
  const parsed = Number(matches[0])
  return Number.isFinite(parsed) ? parsed : null
}

const formatServicePrice = (value: string, currency: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/[฿$€]/.test(trimmed)) return trimmed

  const matches = trimmed.replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []
  if (!matches.length) return trimmed

  if (matches.length >= 2) {
    const first = Number(matches[0])
    const second = Number(matches[1])
    if (Number.isFinite(first) && Number.isFinite(second)) {
      return `${formatCurrencyAmount(first, currency)} - ${formatCurrencyAmount(second, currency)}`
    }
  }

  const first = Number(matches[0])
  if (!Number.isFinite(first)) return trimmed
  if (/from/i.test(trimmed)) return `From ${formatCurrencyAmount(first, currency)}`
  if (/up to/i.test(trimmed)) return `Up to ${formatCurrencyAmount(first, currency)}`
  return formatCurrencyAmount(first, currency)
}

const countryLabel = (countrySlug: string) =>
  countrySlug
    .split('-')
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(' ')

export function ServicesAndFeesSection({
  practiceAreaDetails = [],
  practiceAreas = [],
  countrySlug,
  hourlyFeeMin,
  hourlyFeeMax,
  hourlyFeeCurrency,
  hourlyFeeNote,
}: ServicesAndFeesSectionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const details = useMemo(
    () =>
      (practiceAreaDetails || [])
        .map((item) => {
          const detail = item as DetailItem
          const relatedArea =
            typeof detail.practiceArea === 'object'
              ? (detail.practiceArea as PracticeArea)
              : practiceAreas.find((entry) => entry.id === detail.practiceArea)

          if (!relatedArea) return null

          const currency = detail.priceCurrency || hourlyFeeCurrency || 'THB'
          const services = (detail.services || [])
            .map((service) => ({
              name: service?.name || '',
              price: formatServicePrice(service?.price || '', currency),
              description: service?.description || '',
            }))
            .filter((service) => service.name)
          const servicePriceNumbers = services
            .map((service) => parsePriceNumber(service.price))
            .filter((price): price is number => typeof price === 'number')
          const lowestServicePrice = servicePriceNumbers.length ? Math.min(...servicePriceNumbers) : null
          const areaPrice = lowestServicePrice
            ? `From ${formatCurrencyAmount(lowestServicePrice, currency)}`
            : formatAreaPrice({
                priceMin: detail.priceMin,
                priceMax: detail.priceMax,
                priceCurrency: currency,
                priceNote: detail.priceNote,
              })

          return {
            area: relatedArea,
            priceLabel: areaPrice,
            services,
          }
        })
        .filter(Boolean) as Array<{
        area: PracticeArea
        priceLabel: string
        services: Array<{ name: string; price: string; description: string }>
      }>,
    [practiceAreaDetails, practiceAreas],
  )

  if (!details.length && !practiceAreas.length) return null

  const hourlyFeeLabel = formatAreaPrice({
    priceMin: hourlyFeeMin,
    priceMax: hourlyFeeMax,
    priceCurrency: hourlyFeeCurrency || 'THB',
    priceNote: hourlyFeeNote,
  })

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const hourlyFeeKey = 'hourly-fee'

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">Services & Fees</h2>

      {(hourlyFeeLabel || details.length > 0) && (
        <div className="mt-4 overflow-hidden rounded-xl border border-warm-200 bg-white shadow-sm">
          {hourlyFeeLabel && (
            <>
              <button
                type="button"
                onClick={() => toggle(hourlyFeeKey)}
                className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-cream-50"
              >
                <BriefcaseBusiness className="h-4 w-4 shrink-0 text-royal-600" />
                <span className="flex-1 pr-2">
                  <span className="block font-semibold text-royal-900">Hourly Fee</span>
                </span>
                <span className="pt-0.5 text-right text-sm font-semibold text-royal-900">{hourlyFeeLabel}</span>
                {openItems[hourlyFeeKey] ? (
                  <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                ) : (
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                )}
              </button>
              {openItems[hourlyFeeKey] && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-royal-600">
                    {hourlyFeeNote || 'Hourly rates may vary based on case complexity and attorney experience.'}
                  </p>
                </div>
              )}
              {details.length > 0 && <div className="border-b border-warm-200" />}
            </>
          )}

          {details.length > 0 &&
            details.map(({ area, priceLabel, services }, index) => {
              const key = String(area.id)
              const isOpen = Boolean(openItems[key])
              const isLastItem = index === details.length - 1 && !hourlyFeeLabel

              return (
                <div key={key} className={!isLastItem ? 'border-b border-warm-200' : ''}>
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-cream-50"
                  >
                    <BriefcaseBusiness className="h-4 w-4 shrink-0 text-royal-600" />
                    <span className="flex-1 pr-2">
                      <span className="block font-semibold text-royal-900">{area.name}</span>
                    </span>
                    <span className="pt-0.5 text-right text-sm font-semibold text-royal-900">{priceLabel}</span>
                    {isOpen ? (
                      <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                    ) : (
                      <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">
                      {services.length > 0 && (
                        <div className="mt-2 overflow-hidden rounded-lg border border-warm-200 bg-cream-50/50">
                          {services.map((service, serviceIndex) => (
                            <div
                              key={`${area.id}-${service.name}-${serviceIndex}`}
                              className={`px-4 py-3 ${serviceIndex !== services.length - 1 ? 'border-b border-warm-100' : ''}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-medium text-royal-800">{service.name}</p>
                                {service.price && (
                                  <p className="text-sm font-semibold text-royal-900">{service.price}</p>
                                )}
                              </div>
                              {service.description && (
                                <p className="mt-0.5 text-xs text-royal-600">{service.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/${countrySlug}/lawyers/${area.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-royal-600 transition-colors hover:text-royal-800"
                      >
                        View all {area.name} lawyers in {countryLabel(countrySlug)}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}
      {details.length === 0 && !hourlyFeeLabel && practiceAreas.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {practiceAreas.map((area) => (
            <Link
              key={area.id}
              href={`/${countrySlug}/lawyers/${area.slug}`}
              className="rounded-full bg-royal-50 px-3 py-1.5 text-sm font-medium text-royal-700 transition-colors hover:bg-royal-100"
            >
              {area.name}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-royal-500">
        Prices are indicative and may vary based on case complexity. Contact the firm for a personalized quote.
      </p>
    </section>
  )
}
