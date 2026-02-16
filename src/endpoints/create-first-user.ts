import { APIError } from 'payload'
import type { Endpoint } from 'payload'

/**
 * Endpoint to create the first admin user
 * POST /api/create-first-user
 * Body: { email: string, password: string, name: string }
 */
export const createFirstUserEndpoint: Endpoint = {
  path: '/create-first-user',
  method: 'post',
  handler: async (req) => {
    try {
      const { email, password, name } = await req.json()

      if (!email || !password || !name) {
        return Response.json(
          { error: 'Email, password, and name are required' },
          { status: 400 },
        )
      }

      // Check if any users exist
      const userCount = await req.payload.count({
        collection: 'users',
      })

      if (userCount > 0) {
        return Response.json(
          { error: 'Users already exist. Please log in or use the admin panel to create users.' },
          { status: 403 },
        )
      }

      // Check if user with this email already exists
      const existingUsers = await req.payload.find({
        collection: 'users',
        where: { email: { equals: email } },
        limit: 1,
      })

      if (existingUsers.docs.length > 0) {
        return Response.json(
          { error: `User with email ${email} already exists` },
          { status: 409 },
        )
      }

      // Create the first admin user
      const user = await req.payload.create({
        collection: 'users',
        data: {
          email,
          password,
          name,
          role: 'admin',
        },
        overrideAccess: true, // Bypass access control for first user
      })

      return Response.json({
        success: true,
        message: 'First admin user created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    } catch (error) {
      console.error('Error creating first user:', error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : 'Failed to create user',
        },
        { status: 500 },
      )
    }
  },
}
