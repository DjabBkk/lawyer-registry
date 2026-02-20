import { APIError } from 'payload'
import type { Endpoint } from 'payload'

import { businesses } from './data/businesses'
import { locations } from './data/locations'
import { practiceAreas } from './data/practiceAreas'
import { services } from './data/services'
import { toKebabCase } from '@/utilities/toKebabCase'

const ensureAuthenticated = (user: unknown) => {
  if (!user) {
    throw new APIError('Authentication required', 401)
  }
}

const getCounts = async (req: Parameters<Endpoint['handler']>[0]) => {
  const [practiceAreasResult, servicesResult, locationsResult, businessesResult] = await Promise.all([
    req.payload.find({
      collection: 'practice-areas',
      depth: 0,
      limit: 0,
    }),
    req.payload.find({
      collection: 'services',
      depth: 0,
      limit: 0,
    }),
    req.payload.find({
      collection: 'locations',
      depth: 0,
      limit: 0,
    }),
    req.payload.find({
      collection: 'businesses',
      depth: 0,
      limit: 0,
    }),
  ])

  return {
    practiceAreas: practiceAreasResult.totalDocs,
    services: servicesResult.totalDocs,
    locations: locationsResult.totalDocs,
    businesses: businessesResult.totalDocs,
  }
}

const practiceAreaAliases: Record<string, string> = {
  'Corporate Law': 'Corporate & Business Law',
  'Mergers & Acquisitions': 'Corporate & Business Law',
  'Employment Law': 'Employment & Labor Law',
  'Wills & Estate Planning': 'Estate Planning & Probate',
  'Contract Law': 'Civil Litigation & Dispute Resolution',
  'International Trade': 'International Trade Law',
  'Entertainment Law': 'Entertainment & Media Law',
  'Intellectual Property': 'Intellectual Property Law',
  'Personal Injury': 'Personal Injury Law',
  'Banking & Finance': 'Banking & Finance Law',
}

const responseTimeOptions = [
  'within-1-hour',
  'within-24-hours',
  'within-48-hours',
  'within-1-week',
] as const

const bangkokTransitHints = [
  'BTS Asok / MRT Sukhumvit (5 min walk)',
  'BTS Sala Daeng / MRT Silom (4 min walk)',
  'BTS Phrom Phong (6 min walk)',
  'BTS Chong Nonsi (3 min walk)',
  'MRT Lumphini (7 min walk)',
] as const

const practiceAreaServiceTemplates: Record<string, string[]> = {
  'Criminal Law': [
    'Criminal defense strategy',
    'Police interview support',
    'Bail applications',
    'Courtroom representation',
  ],
  'Family Law': [
    'Divorce and separation agreements',
    'Child custody planning',
    'Child support advisory',
    'Prenuptial and postnuptial agreements',
  ],
  'Immigration Law': [
    'Work permit applications',
    'Long-term visa support',
    'Business visa strategy',
    'Immigration compliance checks',
    'Visa overstay resolution',
  ],
  'Real Estate Law': [
    'Property due diligence',
    'Sale and purchase agreements',
    'Lease drafting and review',
    'Title and encumbrance checks',
  ],
  'Corporate Law': [
    'Company incorporation',
    'Shareholder agreements',
    'Regulatory compliance',
    'Board governance advisory',
  ],
  'Mergers & Acquisitions': [
    'Transaction structuring',
    'M&A due diligence',
    'SPA drafting and negotiation',
    'Post-merger integration support',
  ],
  'Tax Law': [
    'Corporate tax planning',
    'Cross-border tax advisory',
    'Tax audit support',
    'Tax dispute resolution',
  ],
  'Intellectual Property': [
    'Trademark registration',
    'IP portfolio strategy',
    'Licensing agreements',
    'Infringement enforcement',
  ],
  'Employment Law': [
    'Employment contract drafting',
    'Labor compliance audits',
    'Termination and severance planning',
    'Workplace dispute resolution',
  ],
  'Banking & Finance': [
    'Loan and security documents',
    'Project finance advisory',
    'Regulatory banking compliance',
    'Debt restructuring support',
  ],
  'Insurance Law': [
    'Coverage analysis',
    'Claims strategy',
    'Policy wording reviews',
    'Insurance dispute resolution',
  ],
  'Personal Injury': [
    'Accident claim advisory',
    'Damages quantification',
    'Settlement negotiations',
    'Court representation',
  ],
  'Medical Malpractice': [
    'Clinical negligence review',
    'Expert coordination',
    'Compensation claim strategy',
    'Mediation and litigation support',
  ],
  'Construction Law': [
    'EPC and construction contract drafting',
    'Variation and claims management',
    'Delay and defect dispute resolution',
    'Project risk allocation advisory',
  ],
  'Environmental Law': [
    'Environmental compliance advisory',
    'Permit and licensing support',
    'EIA-related legal strategy',
    'Regulatory enforcement defense',
  ],
  'International Trade': [
    'Import/export compliance',
    'Customs dispute support',
    'Trade contract structuring',
    'Cross-border risk advisory',
  ],
  'Maritime Law': [
    'Charterparty and shipping contracts',
    'Marine insurance disputes',
    'Port and cargo claims',
    'Admiralty litigation support',
  ],
  'Aviation Law': [
    'Aircraft lease and finance',
    'Regulatory aviation compliance',
    'Operational incident advisory',
    'Aviation dispute management',
  ],
  'Entertainment Law': [
    'Talent and production contracts',
    'Music and media licensing',
    'Brand and sponsorship advisory',
    'Rights clearance support',
  ],
  'Sports Law': [
    'Athlete contract negotiation',
    'Sponsorship and endorsement deals',
    'Club governance advisory',
    'Disciplinary dispute representation',
  ],
  'Bankruptcy & Insolvency': [
    'Debt restructuring support',
    'Creditor rights strategy',
    'Insolvency proceedings advisory',
    'Turnaround planning',
  ],
  'Arbitration & Mediation': [
    'Arbitration case management',
    'Mediation strategy',
    'Settlement framework drafting',
    'Award enforcement support',
  ],
  'Cybersecurity & Data Privacy': [
    'PDPA compliance programs',
    'Data breach response support',
    'Cross-border data transfer advisory',
    'Cyber incident risk management',
  ],
  'Wills & Estate Planning': [
    'Will drafting and updates',
    'Trust structuring',
    'Probate support',
    'Cross-border estate planning',
  ],
  'Contract Law': [
    'Commercial contract drafting',
    'Contract risk reviews',
    'Negotiation support',
    'Breach and dispute strategy',
  ],
}

const listingTierForIndex = (index: number): 'free' | 'bronze' | 'gold' => {
  if (index < 5) return 'gold'
  if (index < 15) return 'bronze'
  return 'free'
}

const estimateTeamSizeFromBand = (band?: string) => {
  switch (band) {
    case '1-5':
      return '5+'
    case '6-10':
      return '10+'
    case '11-25':
      return '25+'
    case '26-50':
      return '50+'
    case '51-100':
      return '100+'
    case '100+':
      return '150+'
    default:
      return '20+'
  }
}

const toCurrencySymbol = (currency: 'THB' | 'USD' | 'EUR') => {
  if (currency === 'USD') return '$'
  if (currency === 'EUR') return '€'
  return '฿'
}

const formatPrice = (value: number, currency: 'THB' | 'USD' | 'EUR') =>
  `${toCurrencySymbol(currency)}${value.toLocaleString()}`

const buildServiceRows = ({
  practiceAreaName,
  baseMin,
  baseMax,
  currency,
}: {
  practiceAreaName: string
  baseMin: number
  baseMax: number
  currency: 'THB' | 'USD' | 'EUR'
}) => {
  const templateServices = practiceAreaServiceTemplates[practiceAreaName] || [
    `${practiceAreaName} strategy and advisory`,
    `${practiceAreaName} documentation support`,
    `${practiceAreaName} dispute management`,
  ]

  const count = Math.max(3, Math.min(6, templateServices.length))

  return templateServices.slice(0, count).map((service, serviceIndex) => {
    const min = Math.round((baseMin * (1 + serviceIndex * 0.25)) / 100) * 100
    const max = Math.round(Math.min(baseMax, min * (1.4 + serviceIndex * 0.1)) / 100) * 100
    const price =
      serviceIndex % 3 === 0
        ? `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`
        : serviceIndex % 3 === 1
          ? `From ${formatPrice(min, currency)}`
          : 'On request'

    return {
      name: service,
      price,
      description: `Comprehensive support for ${service.toLowerCase()} with clear scope, timelines, and practical guidance.`,
    }
  })
}

const buildPracticeAreaDetails = ({
  firm,
  getPracticeAreaId,
}: {
  firm: (typeof businesses)[number]
  getPracticeAreaId: (name: string) => number
}) =>
  firm.practiceAreas.slice(0, 5).map((practiceAreaName, practiceAreaIndex) => {
    const currency = firm.feeCurrency || 'THB'
    const baseMin =
      Math.round(((firm.feeRangeMin || 2500) * (1 + practiceAreaIndex * 0.15)) / 100) * 100
    const baseMax =
      Math.round(((firm.feeRangeMax || baseMin * 3) * (1 + practiceAreaIndex * 0.1)) / 100) * 100
    const services = buildServiceRows({
      practiceAreaName,
      baseMin,
      baseMax,
      currency,
    })

    return {
      practiceArea: getPracticeAreaId(practiceAreaName),
      description: `${firm.name} supports local and international clients with practical ${practiceAreaName.toLowerCase()} solutions tailored to matters in ${firm.primaryLocation} and across Thailand.`,
      priceMin: baseMin,
      priceMax: baseMax,
      priceCurrency: currency,
      priceNote: practiceAreaIndex % 2 === 0 ? 'fixed fee range' : 'starting from',
      services,
    }
  })

const buildServicePricing = (firm: (typeof businesses)[number]) => {
  const currency = firm.feeCurrency || 'THB'
  const baseMin = firm.feeRangeMin || 2500
  const baseMax = firm.feeRangeMax || baseMin * 3

  const entries: Array<{
    serviceName: string
    priceMin?: number
    priceMax?: number
    priceNote?: string
    currency: 'THB' | 'USD' | 'EUR'
  }> = [
    {
      serviceName: 'Initial Consultation',
      priceMin: baseMin,
      priceMax: Math.max(baseMin, Math.round((baseMin * 1.4) / 100) * 100),
      priceNote: 'starting from',
      currency,
    },
  ]

  const pricedServices = (firm.services || []).slice(0, 4)
  pricedServices.forEach((service, idx) => {
    const min = Math.round((baseMin * (1 + idx * 0.25)) / 100) * 100
    const max = Math.round(Math.min(baseMax, min * 2.2) / 100) * 100

    entries.push({
      serviceName: service.service,
      priceMin: min,
      priceMax: max,
      priceNote: idx % 2 === 0 ? 'fixed fee' : 'estimated range',
      currency,
    })
  })

  return entries.slice(0, 5)
}

const buildCaseHighlights = (firm: (typeof businesses)[number]) => {
  const areas = firm.practiceAreas.slice(0, 3)

  return areas.map((area, idx) => ({
    title: `${area} outcomes for clients in ${firm.primaryLocation}`,
    description: `Delivered consistent ${area.toLowerCase()} support for individuals and businesses in ${firm.primaryLocation}, with clear communication and practical timelines from intake to resolution.`,
    metric:
      idx === 0
        ? '95%+ positive outcomes'
        : idx === 1
          ? '200+ matters advised'
          : '15+ years combined experience',
  }))
}

const buildTestimonials = (firm: (typeof businesses)[number]) => [
  {
    quote: `The team at ${firm.name} was clear, responsive, and commercially practical from day one.`,
    authorName: 'International Client',
    authorTitle: `Business Owner, ${firm.primaryLocation}`,
    rating: 5 as const,
  },
  {
    quote: `We appreciated how they explained each legal step and delivered exactly on timeline.`,
    authorName: 'Private Client',
    authorTitle: `${firm.primaryLocation} Resident`,
    rating: 5 as const,
  },
]

const buildFaq = (firm: (typeof businesses)[number]) => {
  const leadArea = firm.practiceAreas[0] || 'legal'

  return [
    {
      question: `How quickly can ${firm.name} start on a new ${leadArea.toLowerCase()} matter?`,
      answer:
        'Most matters can begin after an initial consultation and document review. Urgent matters are prioritized and assigned immediately when capacity allows.',
    },
    {
      question: 'Do you support foreign clients and bilingual communication?',
      answer:
        'Yes. We regularly support international clients and coordinate updates in clear business English and Thai.',
    },
    {
      question: 'Can I get a clear quote before proceeding?',
      answer:
        'Yes. After scoping your matter, we provide an indicative fee range and recommend the most cost-effective engagement model.',
    },
  ]
}

const buildHighlights = (firm: (typeof businesses)[number]) => {
  const highlightItems = []

  if (firm.foundingYear) {
    const years = Math.max(1, new Date().getFullYear() - firm.foundingYear)
    highlightItems.push({
      label: 'Years of Experience',
      value: `${years}+`,
    })
  }

  highlightItems.push({
    label: 'Team Capacity',
    value: estimateTeamSizeFromBand(firm.companySize),
  })

  if (firm.languages?.length) {
    highlightItems.push({
      label: 'Languages Supported',
      value: `${firm.languages.length}`,
    })
  }

  highlightItems.push({
    label: 'Practice Areas',
    value: `${firm.practiceAreas.length}+`,
  })

  return highlightItems.slice(0, 4)
}

export const seedStatusEndpoint: Endpoint = {
  path: '/seed',
  method: 'get',
  handler: async (req) => {
    ensureAuthenticated(req.user)
    const counts = await getCounts(req)

    return Response.json({
      seeded: counts.practiceAreas > 0 || counts.services > 0 || counts.locations > 0 || counts.businesses > 0,
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
    if (counts.practiceAreas > 0 || counts.services > 0 || counts.locations > 0 || counts.businesses > 0) {
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
        draft: false,
        data: {
          name: item.name,
          slug: toKebabCase(item.name),
          shortDescription: item.shortDescription,
          icon: item.icon,
          featured: item.featured,
          featuredOrder: item.featuredOrder,
          tier: item.tier,
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
        draft: false,
        data: {
          name: item.name,
          slug: toKebabCase(item.name),
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

    const practiceAreaIdByName = new Map(createdPracticeAreas.map((doc) => [doc.name, doc.id]))
    const locationIdByName = new Map(createdLocations.map((doc) => [doc.name, doc.id]))

    const createdServices = []
    for (const item of services) {
      const practiceAreaId = practiceAreaIdByName.get(item.practiceAreaName)
      if (!practiceAreaId) {
        throw new APIError(
          `Practice area not found for service "${item.name}" (${item.slug}): ${item.practiceAreaName}`,
          400,
        )
      }

      const created = await req.payload.create({
        collection: 'services',
        draft: false,
        data: {
          name: item.name,
          slug: item.slug,
          practiceArea: practiceAreaId,
          shortDescription: item.shortDescription,
          seoTitleTemplate: item.seoTitleTemplate,
          tier: item.tier,
          featured: false,
        },
        req,
      })
      createdServices.push(created)
    }

    const getPracticeAreaIds = (names: string[]) =>
      names.map((name) => {
        const canonicalName = practiceAreaAliases[name] || name
        const id = practiceAreaIdByName.get(canonicalName)
        if (!id) {
          throw new APIError(`Practice area not found: ${name} (mapped as ${canonicalName})`, 400)
        }
        return id
      })

    const getPracticeAreaId = (name: string) => {
      const canonicalName = practiceAreaAliases[name] || name
      const id = practiceAreaIdByName.get(canonicalName)
      if (!id) {
        throw new APIError(`Practice area not found: ${name} (mapped as ${canonicalName})`, 400)
      }
      return id
    }

    const getLocationId = (name: string) => {
      const id = locationIdByName.get(name)
      if (!id) {
        throw new APIError(`Location not found: ${name}`, 400)
      }
      return id
    }

    const createdBusinesses = []
    for (const [index, firm] of businesses.entries()) {
      const locationIds = firm.locations.map(getLocationId)
      const primaryLocationId = getLocationId(firm.primaryLocation)
      const businessType = firm.businessType || 'law-firm'
      const serviceCategories =
        firm.serviceCategories ||
        (businessType === 'accounting-firm' || businessType === 'accountant'
          ? ['accounting', 'company-registration', 'tax']
          : ['legal'])
      const listingTier = firm.listingTier || listingTierForIndex(index)
      const verified = firm.verified ?? listingTier !== 'free'
      const responseTime =
        firm.responseTime || responseTimeOptions[index % responseTimeOptions.length]
      const nearestTransit =
        firm.nearestTransit ||
        (firm.locations.includes('Bangkok')
          ? bangkokTransitHints[index % bangkokTransitHints.length]
          : undefined)
      const hourlyFeeCurrency = firm.hourlyFeeCurrency || firm.feeCurrency || 'THB'
      const derivedHourlyMin =
        typeof firm.feeRangeMin === 'number'
          ? Math.max(1000, Math.round((firm.feeRangeMin * 0.35) / 100) * 100)
          : undefined
      const derivedHourlyMax =
        typeof firm.feeRangeMax === 'number'
          ? Math.max(derivedHourlyMin || 0, Math.round((firm.feeRangeMax * 0.45) / 100) * 100)
          : undefined
      const hourlyFeeMin = firm.hourlyFeeMin ?? derivedHourlyMin
      const hourlyFeeMax = firm.hourlyFeeMax ?? derivedHourlyMax
      const hourlyFeeNote =
        firm.hourlyFeeNote || (hourlyFeeMin || hourlyFeeMax ? 'indicative hourly rate' : undefined)

      const tagline =
        firm.tagline ||
        `${firm.primaryLocation}-based ${firm.practiceAreas.slice(0, 2).join(' and ').toLowerCase()} team helping local and international clients.`

      const highlights = firm.highlights || buildHighlights(firm)
      const practiceAreaDetails =
        firm.practiceAreaDetails?.map((item) => ({
          practiceArea: getPracticeAreaId(item.practiceArea),
          description: item.description,
          priceMin: item.priceMin,
          priceMax: item.priceMax,
          priceCurrency: item.priceCurrency || firm.feeCurrency || 'THB',
          priceNote: item.priceNote,
          services: (item.services || []).map((service) => ({
            name: service.name,
            price: service.price,
            description: service.description,
          })),
        })) || buildPracticeAreaDetails({ firm, getPracticeAreaId })

      const servicePricing =
        firm.servicePricing?.map((item) => ({
          serviceName: item.serviceName,
          priceMin: item.priceMin,
          priceMax: item.priceMax,
          priceNote: item.priceNote,
          currency: item.currency || firm.feeCurrency || 'THB',
        })) || buildServicePricing(firm)

      const caseHighlights = firm.caseHighlights || buildCaseHighlights(firm).slice(0, 3)
      const testimonials = firm.testimonials || buildTestimonials(firm).slice(0, 3)
      const faq = firm.faq || buildFaq(firm).slice(0, 4)

      const officeLocations = firm.officeLocations?.map((office) => ({
        location: getLocationId(office.location),
        address: office.address,
        phone: office.phone,
        email: office.email,
        googleMapsUrl: office.googleMapsUrl,
        nearestTransit:
          office.nearestTransit ||
          (office.location === 'Bangkok'
            ? bangkokTransitHints[index % bangkokTransitHints.length]
            : undefined),
        openingHours: office.openingHours,
      }))

      const created = await req.payload.create({
        collection: 'businesses',
        draft: false,
        data: {
          name: firm.name,
          slug: toKebabCase(firm.name),
          email: firm.email,
          phone: firm.phone,
          website: firm.website,
          address: firm.address,
          googleMapsUrl: firm.googleMapsUrl,
          shortDescription: firm.shortDescription,
          tagline,
          featured: firm.featured,
          featuredOrder: firm.featuredOrder,
          businessType,
          serviceCategories,
          listingTier,
          verified,
          foundingYear: firm.foundingYear,
          companySize: firm.companySize,
          languages: firm.languages,
          feeRangeMin: firm.feeRangeMin,
          feeRangeMax: firm.feeRangeMax,
          feeCurrency: firm.feeCurrency,
          hourlyFeeMin,
          hourlyFeeMax,
          hourlyFeeCurrency,
          hourlyFeeNote,
          responseTime,
          nearestTransit,
          highlights,
          practiceAreaDetails,
          servicePricing,
          caseHighlights,
          testimonials,
          faq,
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

      createdBusinesses.push(created)
    }

    const updatedCounts = await getCounts(req)

    return Response.json({
      message: 'Seed data created',
      counts: updatedCounts,
      created: {
        practiceAreas: createdPracticeAreas.length,
        services: createdServices.length,
        locations: createdLocations.length,
        businesses: createdBusinesses.length,
      },
    })
  },
}
