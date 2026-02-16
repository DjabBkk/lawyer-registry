import type { Endpoint } from 'payload'

/**
 * Endpoint to update a user's password and/or role
 * POST /api/update-user
 * Body: { email: string, newPassword?: string, role?: 'admin' | 'editor' }
 * 
 * WARNING: This endpoint should be removed or secured in production!
 */
export const updateUserEndpoint: Endpoint = {
  path: '/update-user',
  method: 'post',
  handler: async (req) => {
    try {
      const { email, newPassword, role } = await req.json()

      if (!email) {
        return Response.json(
          { error: 'Email is required' },
          { status: 400 },
        )
      }

      if (newPassword && newPassword.length < 8) {
        return Response.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 },
        )
      }

      if (role && !['admin', 'editor'].includes(role)) {
        return Response.json(
          { error: 'Role must be either "admin" or "editor"' },
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

      // Prepare update data
      const updateData: { password?: string; role?: 'admin' | 'editor' } = {}
      if (newPassword) {
        updateData.password = newPassword
      }
      if (role) {
        updateData.role = role as 'admin' | 'editor'
      }

      if (Object.keys(updateData).length === 0) {
        return Response.json(
          { error: 'Either newPassword or role must be provided' },
          { status: 400 },
        )
      }

      // Update the user
      const updatedUser = await req.payload.update({
        collection: 'users',
        id: user.id,
        data: updateData,
        overrideAccess: true, // Bypass access control
      })

      return Response.json({
        success: true,
        message: `User updated successfully`,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      })
    } catch (error) {
      console.error('Error updating user:', error)
      return Response.json(
        {
          error: error instanceof Error ? error.message : 'Failed to update user',
        },
        { status: 500 },
      )
    }
  },
}
