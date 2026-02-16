interface CaseHighlightsSectionProps {
  caseHighlights?: Array<{
    title?: string | null
    description?: string | null
    metric?: string | null
  }> | null
}

export function CaseHighlightsSection({ caseHighlights }: CaseHighlightsSectionProps) {
  const highlights = (caseHighlights || []).filter(
    (item: any) => item?.title && item?.description,
  ) as Array<{
    title: string
    description: string
    metric?: string
  }>

  if (!highlights.length) return null

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">Track Record</h2>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {highlights.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className="rounded-lg border-l-4 border-gold-500 bg-white p-5 shadow-sm"
          >
            {item.metric && (
              <p className="font-heading text-2xl font-bold text-gold-600">{item.metric}</p>
            )}
            <h3 className={`text-base font-semibold text-royal-900 ${item.metric ? 'mt-1' : ''}`}>
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-royal-700">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
