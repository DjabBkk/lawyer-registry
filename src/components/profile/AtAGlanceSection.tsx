import type { LawFirm } from '@/payload-types'

type HighlightItem = NonNullable<LawFirm['highlights']>[number]

interface AtAGlanceSectionProps {
  firm: LawFirm
}

export function AtAGlanceSection({ firm }: AtAGlanceSectionProps) {
  const cards: Array<{ label: string; value: string }> = []

  ;(firm.highlights || []).forEach((item) => {
    const highlight = item as HighlightItem
    if (highlight?.label && highlight?.value) {
      cards.push({ label: highlight.label, value: highlight.value })
    }
  })

  if (firm.foundingYear) {
    cards.push({ label: 'Founded', value: String(firm.foundingYear) })
  }

  if (firm.companySize) {
    cards.push({ label: 'Team Size', value: firm.companySize })
  }

  if (firm.languages?.length) {
    cards.push({ label: 'Languages', value: firm.languages.join(', ') })
  }

  const uniqueCards = cards.filter(
    (card, idx, all) =>
      all.findIndex((candidate) => candidate.label === card.label && candidate.value === card.value) === idx,
  )

  if (!uniqueCards.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">At a Glance</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {uniqueCards.map((card, index) => (
          <article
            key={`${card.label}-${index}`}
            className="rounded-xl border border-warm-200 bg-cream-100 p-4"
          >
            <p className="font-heading text-2xl font-bold text-royal-900">{card.value}</p>
            <p className="mt-1 text-sm text-royal-600">{card.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
