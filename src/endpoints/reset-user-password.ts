import { APIError } from 'payload'
import type { Endpoint } from 'payload'

/**
 * Endpoint to reset a user's password (useful when user exists but password is unknown)
 * POST /api/reset-user-password
 * Body: { email: string, newPassword: string }
 * 
 * WARNING: This endpoint should be removed or secured in production!
 */
export const resetUserPasswordEndpoint: Endpoint = {
  path: '/reset-user-password',
  method: 'post',
  handler: async (req) => {
    try {
      const body = req.json ? await req.json() : null
      const { email, newPassword } = (body || {}) as {
        email?: string
        newPassword?: string
      }

      if (!email || !newPassword) {
        return Response.json(
          { error: 'Email and newPassword are required' },
          { status: 400 },
        )
      }

      if (newPassword.length < 8) {
        return Response.json(
          { error: 'Password must be at least 8 characters long' },
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

      // Update the user's password
      await req.payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: newPassword,
        },
        overrideAccess: true, // Bypass access control
      })

      return Response.json({
        success: true,
        message: `Password reset successfully for ${email}`,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (error) {
      console.error('Error resetting user password:', error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : 'Failed to reset password',
        },
        { status: 500 },
      )
    }
  },
}
