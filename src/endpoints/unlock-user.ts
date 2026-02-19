import type { Endpoint } from 'payload'

/**
 * Endpoint to unlock a user who has been locked due to failed login attempts
 * POST /api/unlock-user
 * Body: { email: string }
 * 
 * WARNING: This endpoint should be removed or secured in production!
 */
export const unlockUserEndpoint: Endpoint = {
  path: '/unlock-user',
  method: 'post',
  handler: async (req) => {
    try {
      const body = req.json ? await req.json() : null
      const { email } = (body || {}) as { email?: string }

      if (!email) {
        return Response.json(
          { error: 'Email is required' },
          { status: 400 },
        )
      }

      // Find the user
      const { docs } = await req.payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })

      if (docs.length === 0) {
        return Response.json(
          { error: `User with email ${email} not found` },
          { status: 404 },
        )
      }

      const user = docs[0]

      // Unlock the user by resetting loginAttempts and lockUntil
      // Payload CMS uses these fields to track lock status
      const updatedUser = await req.payload.update({
        collection: 'users',
        id: user.id,
        data: {
          loginAttempts: 0,
          lockUntil: null,
        },
        overrideAccess: true, // Bypass access control
      })

      return Response.json({
        success: true,
        message: `User ${email} has been unlocked successfully`,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      })
    } catch (error) {
      console.error('Error unlocking user:', error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : 'Failed to unlock user',
        },
        { status: 500 },
      )
    }
  },
}
