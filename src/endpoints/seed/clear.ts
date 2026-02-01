import { APIError } from 'payload'
import type { Endpoint } from 'payload'

const ensureAuthenticated = (user: unknown) => {
  if (!user) {
    throw new APIError('Authentication required', 401)
  }
}

const deleteAll = async (
  req: Parameters<Endpoint['handler']>[0],
  collection: 'law-firms' | 'practice-areas' | 'locations',
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

    const deletedLawFirms = await deleteAll(req, 'law-firms')
    const deletedPracticeAreas = await deleteAll(req, 'practice-areas')
    const deletedLocations = await deleteAll(req, 'locations')

    return Response.json({
      message: 'Seed data cleared',
      deleted: {
        lawFirms: deletedLawFirms,
        practiceAreas: deletedPracticeAreas,
        locations: deletedLocations,
      },
      counts: {
        lawFirms: 0,
        practiceAreas: 0,
        locations: 0,
      },
    })
  },
}
