'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { X } from 'lucide-react'

import type { Business, PracticeArea } from '@/payload-types'
import { toKebabCase } from '@/utilities/toKebabCase'
import { formatFeeRange } from './profile-helpers'

interface AtAGlanceModalProps {
  firm: Business
  practiceAreas?: PracticeArea[]
  countrySlug: string
  onClose: () => void
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

export function AtAGlanceModal({ firm, practiceAreas = [], countrySlug, onClose }: AtAGlanceModalProps) {
  const baseLawyersPath = `/${countrySlug}/lawyers`

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

  const locationItems = ((firm.locations || []) as Array<any>)
    .filter((location): location is any => typeof location === 'object')
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

  if (firm.languages?.length) {
    cards.push({
      label: 'Languages',
      items: firm.languages.map((language) => ({
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 bg-white text-royal-700 transition-colors hover:bg-cream-50"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <h2 className="font-heading text-2xl font-bold text-royal-900 mb-5">{firm.name} at a glance</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <article key={card.label} className="rounded-lg border border-warm-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-royal-500">{card.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {card.items.map((item, index) => (
                    <Link
                      key={`${item.label}-${item.value}-${index}`}
                      href={item.href}
                      onClick={onClose}
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
      </div>
    </div>
  )
}
