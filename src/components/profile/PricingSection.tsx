import type { LawFirm } from '@/payload-types'

import { formatCurrencyAmount, formatFeeRange } from './profile-helpers'

interface PricingSectionProps {
  firm: LawFirm
}

type PricingEntry = {
  serviceName: string
  priceMin?: number
  priceMax?: number
  priceNote?: string
  currency?: string
}

const formatPricingLabel = (entry: PricingEntry) => {
  const note = entry.priceNote?.toLowerCase() || ''
  if (note.includes('free')) return 'Free'

  if (typeof entry.priceMin === 'number' && typeof entry.priceMax === 'number') {
    return `${formatCurrencyAmount(entry.priceMin, entry.currency || 'THB')} - ${formatCurrencyAmount(entry.priceMax, entry.currency || 'THB')}`
  }

  if (typeof entry.priceMin === 'number') {
    return `From ${formatCurrencyAmount(entry.priceMin, entry.currency || 'THB')}`
  }

  if (typeof entry.priceMax === 'number') {
    return `Up to ${formatCurrencyAmount(entry.priceMax, entry.currency || 'THB')}`
  }

  return 'Contact for quote'
}

export function PricingSection({ firm }: PricingSectionProps) {
  const entries: PricingEntry[] = []
  const consultationLabel = formatFeeRange({
    min: firm.feeRangeMin,
    max: firm.feeRangeMax,
    currency: firm.feeCurrency,
  })

  const servicePricing = (firm.servicePricing || []).map((item: any) => ({
    serviceName: item.serviceName as string,
    priceMin: item.priceMin as number | undefined,
    priceMax: item.priceMax as number | undefined,
    priceNote: item.priceNote as string | undefined,
    currency: item.currency as string | undefined,
  }))

  const includesConsultation = servicePricing.some((item) =>
    item.serviceName.toLowerCase().includes('consult'),
  )

  if (consultationLabel && !includesConsultation) {
    entries.push({
      serviceName: 'Initial Consultation',
      priceMin: firm.feeRangeMin || undefined,
      priceMax: firm.feeRangeMax || undefined,
      priceNote: 'indicative range',
      currency: firm.feeCurrency || 'THB',
    })
  }

  entries.push(...servicePricing)

  if (!entries.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">
        Fees & Pricing Guide
      </h2>
      <div className="mt-5 space-y-3">
        {entries.map((entry, index) => (
          <article
            key={`${entry.serviceName}-${index}`}
            className="rounded-xl border border-border/50 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-medium text-royal-900">{entry.serviceName}</p>
              <p className="font-semibold text-royal-900">{formatPricingLabel(entry)}</p>
            </div>
            {entry.priceNote && (
              <p className="mt-1 text-sm text-royal-600">{entry.priceNote}</p>
            )}
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm text-royal-600">
        Prices are indicative and may vary based on case complexity. Contact the firm for a
        personalized quote.
      </p>
    </section>
  )
}
