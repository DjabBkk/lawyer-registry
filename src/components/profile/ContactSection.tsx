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

export function ContactMapSection({ firm }: ContactMapSectionProps) {
  const primaryLocation = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
  const hasOfficeLocations = firm.officeLocations && firm.officeLocations.length > 0
  const firstOffice = hasOfficeLocations ? firm.officeLocations?.[0] : null
  const mapUrl = firstOffice?.googleMapsUrl || firm.googleMapsUrl

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-royal-900">Contact & Map</h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border border-border/50 bg-white p-6">
            <h3 className="font-heading text-lg font-semibold text-royal-900">Get in Touch</h3>

            <div className="mt-4 space-y-4">
              {firm.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                  <div>
                    <p className="font-medium text-royal-900">Address</p>
                    <p className="whitespace-pre-line text-royal-700/80">{firm.address}</p>
                    {primaryLocation && (
                      <p className="mt-1 text-sm text-royal-700/70">{primaryLocation.name}, Thailand</p>
                    )}
                    {firm.nearestTransit && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-royal-700">
                        <Train className="h-4 w-4 text-royal-600" />
                        {firm.nearestTransit}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {firm.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                  <div>
                    <p className="font-medium text-royal-900">Phone</p>
                    <a href={`tel:${firm.phone}`} className="text-royal-600 hover:text-royal-700">
                      {firm.phone}
                    </a>
                  </div>
                </div>
              )}

              {firm.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                  <div>
                    <p className="font-medium text-royal-900">Email</p>
                    <a href={`mailto:${firm.email}`} className="text-royal-600 hover:text-royal-700">
                      {firm.email}
                    </a>
                  </div>
                </div>
              )}

              {firm.website && (
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-royal-600" />
                  <div>
                    <p className="font-medium text-royal-900">Website</p>
                    <a
                      href={firm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-royal-600 hover:text-royal-700"
                    >
                      {firm.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasOfficeLocations && (
            <div className="rounded-xl border border-border/50 bg-white p-6">
              <h3 className="font-heading text-lg font-semibold text-royal-900">Office Locations</h3>

              <div className="mt-4 space-y-6">
                {firm.officeLocations?.map((office, index) => {
                  const officeLoc = typeof office.location === 'object' ? office.location : null

                  return (
                    <div key={index} className={index > 0 ? 'border-t border-border/50 pt-6' : ''}>
                      {officeLoc && <h4 className="font-medium text-royal-900">{officeLoc.name} Office</h4>}

                      {office.address && (
                        <p className="mt-2 whitespace-pre-line text-sm text-royal-700/80">{office.address}</p>
                      )}
                      {office.nearestTransit && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-royal-700">
                          <Train className="h-4 w-4 text-royal-600" />
                          {office.nearestTransit}
                        </p>
                      )}

                      {(office.phone || office.email) && (
                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          {office.phone && (
                            <a href={`tel:${office.phone}`} className="text-royal-600 hover:text-royal-700">
                              {office.phone}
                            </a>
                          )}
                          {office.email && (
                            <a href={`mailto:${office.email}`} className="text-royal-600 hover:text-royal-700">
                              {office.email}
                            </a>
                          )}
                        </div>
                      )}

                      {office.openingHours && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-royal-900">
                            <Clock className="h-4 w-4 text-royal-600" />
                            Opening Hours
                          </div>
                          <div className="mt-2 space-y-1 text-sm">
                            {dayNames.map((day) => {
                              const hours = office.openingHours?.[day]
                              if (!hours) return null

                              return (
                                <div key={day} className="flex justify-between text-royal-700/80">
                                  <span className="capitalize">{day}</span>
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
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-80 overflow-hidden rounded-xl border border-border/50 lg:h-auto">
          {mapUrl ? (
            <iframe
              src={mapUrl.includes('embed') ? mapUrl : `${mapUrl}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${firm.name} location`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-cream-200">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-royal-300" />
                <p className="mt-2 text-royal-700/70">Map not available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Backward-compatible export name
export const ContactSection = ContactMapSection

