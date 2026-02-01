import { getPayload } from 'payload'
import config from '@payload-config'

import { Hero } from '@/components/home/Hero'
import { FeaturedFirms } from '@/components/home/FeaturedFirms'
import { PracticeAreasGrid } from '@/components/home/PracticeAreasGrid'
import { LocationsGrid } from '@/components/home/LocationsGrid'
import { TrustSignals } from '@/components/home/TrustSignals'

async function getData() {
  const payload = await getPayload({ config })

  const [practiceAreasResult, locationsResult, featuredFirmsResult] = await Promise.all([
    payload.find({
      collection: 'practice-areas',
      limit: 100,
      sort: 'name',
    }),
    payload.find({
      collection: 'locations',
      limit: 100,
      sort: 'name',
    }),
    payload.find({
      collection: 'law-firms',
      where: {
        featured: { equals: true },
        _status: { equals: 'published' },
      },
      limit: 6,
      sort: 'featuredOrder',
      depth: 2,
    }),
  ])

  // Get featured practice areas for homepage
  const featuredPracticeAreas = practiceAreasResult.docs.filter(
    (pa) => pa.featured
  ).slice(0, 8)

  // Get featured locations for homepage
  const featuredLocations = locationsResult.docs.filter(
    (loc) => loc.featured
  ).slice(0, 5)

  // Get counts
  const counts = {
    lawFirms: await payload.count({ collection: 'law-firms', where: { _status: { equals: 'published' } } }),
    practiceAreas: practiceAreasResult.totalDocs,
    locations: locationsResult.totalDocs,
  }

  return {
    practiceAreas: practiceAreasResult.docs,
    locations: locationsResult.docs,
    featuredPracticeAreas,
    featuredLocations,
    featuredFirms: featuredFirmsResult.docs,
    counts: {
      lawFirms: counts.lawFirms.totalDocs,
      practiceAreas: counts.practiceAreas,
      locations: counts.locations,
    },
  }
}

export default async function HomePage() {
  const {
    practiceAreas,
    locations,
    featuredPracticeAreas,
    featuredLocations,
    featuredFirms,
    counts,
  } = await getData()

  return (
    <>
      <Hero
        practiceAreas={practiceAreas.map((pa) => ({
          id: pa.id,
          name: pa.name,
          slug: pa.slug,
        }))}
        locations={locations.map((loc) => ({
          id: loc.id,
          name: loc.name,
          slug: loc.slug,
        }))}
      />

      <FeaturedFirms firms={featuredFirms as any} />

      <PracticeAreasGrid practiceAreas={featuredPracticeAreas} />

      <LocationsGrid locations={featuredLocations} />

      <TrustSignals counts={counts} />
    </>
  )
}
