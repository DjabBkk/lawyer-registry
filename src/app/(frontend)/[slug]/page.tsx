import { notFound, permanentRedirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getPracticeArea(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'practice-areas',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] || null
}

export default async function RootSlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  // Legacy support: /{practiceArea} -> /thailand/lawyers/{practiceArea}
  const practiceArea = await getPracticeArea(slug)
  if (!practiceArea) {
    notFound()
  }

  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(resolvedSearchParams)) {
    if (v === undefined) continue
    qs.set(k, Array.isArray(v) ? v.join(',') : String(v))
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  permanentRedirect(`/thailand/lawyers/${slug}${suffix}`)
}

