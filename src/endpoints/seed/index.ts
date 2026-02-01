import { APIError } from 'payload'
import type { Endpoint } from 'payload'

import { lawFirms } from './data/lawFirms'
import { locations } from './data/locations'
import { practiceAreas } from './data/practiceAreas'

const ensureAuthenticated = (user: unknown) => {
  if (!user) {
    throw new APIError('Authentication required', 401)
  }
}

const getCounts = async (req: Parameters<Endpoint['handler']>[0]) => {
  const [practiceAreasResult, locationsResult, lawFirmsResult] = await Promise.all([
    req.payload.find({
      collection: 'practice-areas',
      depth: 0,
      limit: 0,
    }),
    req.payload.find({
      collection: 'locations',
      depth: 0,
      limit: 0,
    }),
    req.payload.find({
      collection: 'law-firms',
      depth: 0,
      limit: 0,
    }),
  ])

  return {
    practiceAreas: practiceAreasResult.totalDocs,
    locations: locationsResult.totalDocs,
    lawFirms: lawFirmsResult.totalDocs,
  }
}

export const seedStatusEndpoint: Endpoint = {
  path: '/seed',
  method: 'get',
  handler: async (req) => {
    ensureAuthenticated(req.user)
    const counts = await getCounts(req)

    return Response.json({
      seeded: counts.practiceAreas > 0 || counts.locations > 0 || counts.lawFirms > 0,
      counts,
    })
  },
}

export const seedEndpoint: Endpoint = {
  path: '/seed',
  method: 'post',
  handler: async (req) => {
    ensureAuthenticated(req.user)

    const counts = await getCounts(req)
    if (counts.practiceAreas > 0 || counts.locations > 0 || counts.lawFirms > 0) {
      return Response.json(
        {
          error: 'Seed data already exists. Clear the database before seeding again.',
          counts,
        },
        { status: 409 },
      )
    }

    const createdPracticeAreas = []
    for (const item of practiceAreas) {
      const created = await req.payload.create({
        collection: 'practice-areas',
        data: {
          name: item.name,
          shortDescription: item.shortDescription,
          icon: item.icon,
          featured: item.featured,
          featuredOrder: item.featuredOrder,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
        },
        req,
      })
      createdPracticeAreas.push(created)
    }

    const createdLocations = []
    for (const item of locations) {
      const created = await req.payload.create({
        collection: 'locations',
        data: {
          name: item.name,
          region: item.region,
          shortDescription: item.shortDescription,
          featured: item.featured,
          featuredOrder: item.featuredOrder,
          seoTitle: item.seoTitle,
          seoDescription: item.seoDescription,
        },
        req,
      })
      createdLocations.push(created)
    }

    const practiceAreaIdByName = new Map(
      createdPracticeAreas.map((doc) => [doc.name, doc.id]),
    )
    const locationIdByName = new Map(createdLocations.map((doc) => [doc.name, doc.id]))

    const getPracticeAreaIds = (names: string[]) =>
      names.map((name) => {
        const id = practiceAreaIdByName.get(name)
        if (!id) {
          throw new APIError(`Practice area not found: ${name}`, 400)
        }
        return id
      })

    const getLocationId = (name: string) => {
      const id = locationIdByName.get(name)
      if (!id) {
        throw new APIError(`Location not found: ${name}`, 400)
      }
      return id
    }

    const createdLawFirms = []
    for (const firm of lawFirms) {
      const locationIds = firm.locations.map(getLocationId)
      const primaryLocationId = getLocationId(firm.primaryLocation)

      const officeLocations = firm.officeLocations?.map((office) => ({
        location: getLocationId(office.location),
        address: office.address,
        phone: office.phone,
        email: office.email,
        googleMapsUrl: office.googleMapsUrl,
        openingHours: office.openingHours,
      }))

      const created = await req.payload.create({
        collection: 'law-firms',
        data: {
          name: firm.name,
          email: firm.email,
          phone: firm.phone,
          website: firm.website,
          address: firm.address,
          googleMapsUrl: firm.googleMapsUrl,
          shortDescription: firm.shortDescription,
          featured: firm.featured,
          featuredOrder: firm.featuredOrder,
          foundingYear: firm.foundingYear,
          companySize: firm.companySize,
          languages: firm.languages,
          feeRangeMin: firm.feeRangeMin,
          feeRangeMax: firm.feeRangeMax,
          feeCurrency: firm.feeCurrency,
          practiceAreas: getPracticeAreaIds(firm.practiceAreas),
          locations: locationIds,
          primaryLocation: primaryLocationId,
          officeLocations,
          teamMembers: firm.teamMembers,
          services: firm.services,
          _status: 'published',
        },
        req,
      })

      createdLawFirms.push(created)
    }

    const updatedCounts = await getCounts(req)

    return Response.json({
      message: 'Seed data created',
      counts: updatedCounts,
      created: {
        practiceAreas: createdPracticeAreas.length,
        locations: createdLocations.length,
        lawFirms: createdLawFirms.length,
      },
    })
  },
}
