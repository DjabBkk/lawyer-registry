import { Clock, Globe, Mail, MapPin, Phone, Train } from 'lucide-react'

import type { LawFirm, Location } from '@/payload-types'

type OfficeLocation = NonNullable<LawFirm['officeLocations']>[number]

interface ContactMapSectionProps {
  firm: LawFirm & {
    primaryLocation?: Location | number | null
    officeLocations?: Array<OfficeLocation & { location?: Location | number | null }>
  }
}

const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const toEmbedUrl = (url?: string | null, fallbackQuery?: string | null) => {
  try {
    if (url) {
      if (url.includes('/maps/embed') || url.includes('output=embed')) return url

      const parsed = new URL(url)
      const q = parsed.searchParams.get('q') || parsed.searchParams.get('query')
      if (q) {
        return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean)
      const mapPathQuery = pathParts[pathParts.length - 1]
      if (mapPathQuery && mapPathQuery !== 'maps') {
        return `https://www.google.com/maps?q=${encodeURIComponent(mapPathQuery)}&output=embed`
      }
    }
  } catch {
    // Ignore URL parse issues and fall back to address query
  }

  if (fallbackQuery) {
    return `https://www.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&output=embed`
  }

  return null
}

const formatDay = (day: (typeof dayNames)[number]) => `${day.charAt(0).toUpperCase()}${day.slice(1)}`

export function ContactMapSection({ firm }: ContactMapSectionProps) {
  const primaryLocation = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null

  const officeCards =
    firm.officeLocations && firm.officeLocations.length > 0
      ? firm.officeLocations.map((office, index) => {
          const officeLocation = typeof office.location === 'object' ? office.location : null
          const fallbackOfficeQuery = [
            office.address,
            officeLocation?.name ? `${officeLocation.name}, Thailand` : null,
          ]
            .filter(Boolean)
            .join(', ')

          return {
            id: `office-${index}`,
            title: officeLocation ? `${officeLocation.name} Office` : `Office ${index + 1}`,
            address: office.address || firm.address,
            locationName: officeLocation?.name || primaryLocation?.name,
            phone: office.phone || firm.phone,
            email: office.email || firm.email,
            website: firm.website,
            nearestTransit: office.nearestTransit || firm.nearestTransit,
            openingHours: office.openingHours,
            // Use office-specific map data first. Do not fall back to firm-level map URL
            // for branch offices, otherwise multiple offices can point to the same place.
            mapUrl: toEmbedUrl(office.googleMapsUrl, fallbackOfficeQuery || firm.address),
          }
        })
      : [
          {
            id: 'main-office',
            title: primaryLocation ? `${primaryLocation.name} Office` : 'Main Office',
            address: firm.address,
            locationName: primaryLocation?.name,
            phone: firm.phone,
            email: firm.email,
            website: firm.website,
            nearestTransit: firm.nearestTransit,
            openingHours: undefined,
            mapUrl: toEmbedUrl(firm.googleMapsUrl, firm.address),
          },
        ]

  if (!officeCards.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">Contact & Map</h2>

      <div className="mt-4 space-y-5">
        {officeCards.map((office) => (
          <article
            key={office.id}
            className="rounded-xl border border-border/50 bg-white p-5 shadow-sm"
          >
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                <h3 className="font-heading text-lg font-semibold text-royal-900">{office.title}</h3>

                <div className="mt-4 space-y-3">
                  {office.address && (
                    <div className="flex items-start gap-2.5 text-sm text-royal-700">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" />
                      <div>
                        <p className="whitespace-pre-line">{office.address}</p>
                        {office.locationName && (
                          <p className="mt-1 text-royal-600">{office.locationName}, Thailand</p>
                        )}
                      </div>
                    </div>
                  )}

                  {office.nearestTransit && (
                    <p className="flex items-center gap-2 text-sm text-royal-700">
                      <Train className="h-4 w-4 text-royal-600" />
                      {office.nearestTransit}
                    </p>
                  )}

                  {office.phone && (
                    <p className="flex items-center gap-2 text-sm text-royal-700">
                      <Phone className="h-4 w-4 text-royal-600" />
                      <a href={`tel:${office.phone}`} className="hover:text-royal-900">
                        {office.phone}
                      </a>
                    </p>
                  )}

                  {office.email && (
                    <p className="flex items-center gap-2 text-sm text-royal-700">
                      <Mail className="h-4 w-4 text-royal-600" />
                      <a href={`mailto:${office.email}`} className="hover:text-royal-900">
                        {office.email}
                      </a>
                    </p>
                  )}

                  {office.website && (
                    <p className="flex items-center gap-2 text-sm text-royal-700">
                      <Globe className="h-4 w-4 text-royal-600" />
                      <a
                        href={office.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-royal-900"
                      >
                        {office.website.replace(/^https?:\/\//, '')}
                      </a>
                    </p>
                  )}
                </div>

                {office.openingHours && (
                  <div className="mt-4 rounded-lg border border-warm-200 bg-cream-50/50 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-royal-900">
                      <Clock className="h-4 w-4 text-royal-600" />
                      Opening Hours
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-royal-700">
                      {dayNames.map((day) => {
                        const hours = office.openingHours?.[day]
                        if (!hours) return null
                        return (
                          <div key={day} className="flex items-center justify-between gap-4">
                            <span>{formatDay(day)}</span>
                            <span>
                              {hours.closed
                                ? 'Closed'
                                : `${hours.openTime || '09:00'} - ${hours.closeTime || '17:00'}`}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-lg border border-border/50 bg-cream-100">
                {office.mapUrl ? (
                  <iframe
                    src={office.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '280px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${office.title} map`}
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-royal-700/70">
                    Map not available
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// Backward-compatible export name
export const ContactSection = ContactMapSection
