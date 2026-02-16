import type { Endpoint } from 'payload'

/**
 * Endpoint to list all users (for debugging)
 * GET /api/list-users
 * 
 * WARNING: This endpoint should be removed or secured in production!
 */
export const listUsersEndpoint: Endpoint = {
  path: '/list-users',
  method: 'get',
  handler: async (req) => {
    try {
      const { docs, totalDocs } = await req.payload.find({
        collection: 'users',
        limit: 100,
        depth: 0,
      })

      return Response.json({
        total: totalDocs,
        users: docs.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        })),
      })
    } catch (error) {
      console.error('Error listing users:', error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : 'Failed to list users',
        },
        { status: 500 },
      )
    }
  },
}
