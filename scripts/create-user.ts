/**
 * Script to create a Payload CMS user
 * 
 * Usage:
 *   pnpm tsx scripts/create-user.ts <email> <password> <name> [role]
 * 
 * Example:
 *   pnpm tsx scripts/create-user.ts karlvonluckwald@gmail.com mypassword "Karl von Luckwald" admin
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function createUser() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.error('Usage: pnpm tsx scripts/create-user.ts <email> <password> <name> [role]')
    console.error('Example: pnpm tsx scripts/create-user.ts karlvonluckwald@gmail.com mypassword "Karl von Luckwald" admin')
    process.exit(1)
  }

  const [email, password, name, role = 'admin'] = args

  if (!['admin', 'editor'].includes(role)) {
    console.error('Role must be either "admin" or "editor"')
    process.exit(1)
  }

  try {
    const payload = await getPayload({ config })

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: false, // Respect access control
    })

    if (existingUsers.docs.length > 0) {
      console.error(`User with email ${email} already exists!`)
      process.exit(1)
    }

    // Create the user with overrideAccess to bypass authentication requirement
    // This works because we updated the access control to allow first user creation
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        name,
        role: role as 'admin' | 'editor',
      },
      overrideAccess: true, // Bypass access control for script execution
    })

    console.log(`✅ User created successfully!`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   ID: ${user.id}`)
    console.log(`\nYou can now log in at: http://localhost:3000/admin`)
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
    process.exit(1)
  }
}

createUser()
