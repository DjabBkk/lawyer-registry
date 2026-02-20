import { APIError } from 'payload'
import type { Endpoint } from 'payload'

const ensureAuthenticated = (user: unknown) => {
  if (!user) {
    throw new APIError('Authentication required', 401)
  }
}

const deleteAll = async (
  req: Parameters<Endpoint['handler']>[0],
  collection:
    | 'businesses'
    | 'locations'
    | 'services'
    | 'practice-areas'
    | 'countries'
    | 'languages'
    | 'currencies',
) => {
  const docs = await req.payload.find({
    collection,
    depth: 0,
    limit: 200,
  })

  for (const doc of docs.docs) {
    await req.payload.delete({
      collection,
      id: doc.id,
      req,
    })
  }

  return docs.totalDocs
}

export const clearSeedEndpoint: Endpoint = {
  path: '/seed/clear',
  method: 'post',
  handler: async (req) => {
    ensureAuthenticated(req.user)

    const deletedBusinesses = await deleteAll(req, 'businesses')
    const deletedLocations = await deleteAll(req, 'locations')
    const deletedServices = await deleteAll(req, 'services')
    const deletedPracticeAreas = await deleteAll(req, 'practice-areas')
    const deletedCountries = await deleteAll(req, 'countries')
    const deletedLanguages = await deleteAll(req, 'languages')
    const deletedCurrencies = await deleteAll(req, 'currencies')

    return Response.json({
      message: 'Seed data cleared',
      deleted: {
        businesses: deletedBusinesses,
        locations: deletedLocations,
        services: deletedServices,
        practiceAreas: deletedPracticeAreas,
        countries: deletedCountries,
        languages: deletedLanguages,
        currencies: deletedCurrencies,
      },
      counts: {
        businesses: 0,
        locations: 0,
        services: 0,
        practiceAreas: 0,
        countries: 0,
        languages: 0,
        currencies: 0,
      },
    })
  },
}
