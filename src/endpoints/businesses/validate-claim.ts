import type { Endpoint } from 'payload'

const getFirmName = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localizedName = value as Record<string, unknown>
    const englishName = localizedName.en

    if (typeof englishName === 'string' && englishName.trim().length > 0) {
      return englishName
    }

    const firstString = Object.values(localizedName).find(
      (localizedValue): localizedValue is string =>
        typeof localizedValue === 'string' && localizedValue.trim().length > 0,
    )

    if (firstString) {
      return firstString
    }
  }

  return 'This firm'
}

export const validateClaimEndpoint: Endpoint = {
  path: '/validate-claim',
  method: 'get',
  handler: async (req) => {
    const token = req.searchParams?.get('token')?.trim()

    if (!token) {
      return Response.json({ message: 'This claim link is invalid or expired.' }, { status: 404 })
    }

    const result = await req.payload.find({
      collection: 'businesses',
      where: {
        claimToken: {
          equals: token,
        },
      },
      depth: 0,
      limit: 1,
      overrideAccess: true,
      select: {
        id: true,
        name: true,
        claimTokenUsedAt: true,
      },
    })

    const business = result.docs[0]

    if (!business) {
      return Response.json({ message: 'This claim link is invalid or expired.' }, { status: 404 })
    }

    if (business.claimTokenUsedAt) {
      return Response.json({ message: 'This claim link has already been used.' }, { status: 410 })
    }

    return Response.json(
      {
        id: business.id,
        name: getFirmName(business.name),
      },
      { status: 200 },
    )
  },
}
