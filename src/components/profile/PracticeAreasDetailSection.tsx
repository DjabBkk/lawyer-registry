import Link from 'next/link'
import type { LawFirm, PracticeArea } from '@/payload-types'

interface PracticeAreasDetailSectionProps {
  firm: LawFirm
  countrySlug: string
  practiceAreas: PracticeArea[]
}

export function PracticeAreasDetailSection({
  firm,
  countrySlug,
  practiceAreas,
}: PracticeAreasDetailSectionProps) {
  const details = (firm.practiceAreaDetails || []).map((item: any) => {
    const relatedArea =
      typeof item.practiceArea === 'object'
        ? (item.practiceArea as PracticeArea)
        : practiceAreas.find((area) => area.id === item.practiceArea)

    if (!relatedArea) return null

    return {
      area: relatedArea,
      description: item.description as string | undefined,
      specificServices: (item.specificServices || [])
        .map((entry: any) => entry?.service)
        .filter(Boolean) as string[],
    }
  }).filter(Boolean) as Array<{
    area: PracticeArea
    description?: string
    specificServices: string[]
  }>

  if (!details.length && !practiceAreas.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">
        Practice Areas & Expertise
      </h2>

      {details.length > 0 ? (
        <div className="mt-5 space-y-5">
          {details.map(({ area, description, specificServices }) => (
            <article
              key={area.id}
              className="rounded-xl border border-border/50 bg-white p-5 shadow-sm"
            >
              <h3 className="font-heading text-xl font-semibold text-royal-900">
                <Link
                  href={`/${countrySlug}/lawyers/${area.slug}`}
                  className="hover:text-royal-700"
                >
                  {area.name}
                </Link>
              </h3>
              {description && (
                <p className="mt-2 text-royal-700/90">{description}</p>
              )}
              {specificServices.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {specificServices.map((service) => (
                    <span
                      key={`${area.id}-${service}`}
                      className="rounded-full bg-royal-50 px-3 py-1 text-sm text-royal-700"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
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
    </section>
  )
}
