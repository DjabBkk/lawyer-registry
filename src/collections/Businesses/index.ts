import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { toKebabCase } from '@/utilities/toKebabCase'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

const getNameForSlug = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localizedValue = value as Record<string, unknown>
    const englishValue = localizedValue.en

    if (typeof englishValue === 'string') {
      return englishValue
    }

    const firstAvailableValue = Object.values(localizedValue).find(
      (localizedName): localizedName is string => typeof localizedName === 'string',
    )

    return firstAvailableValue
  }

  return undefined
}

const getCountryId = (siblingData?: unknown, data?: unknown) => {
  const siblingRecord =
    siblingData && typeof siblingData === 'object'
      ? (siblingData as Record<string, unknown>)
      : undefined
  const dataRecord =
    data && typeof data === 'object' ? (data as Record<string, unknown>) : undefined

  const fromSiblings = siblingRecord?.country
  if (typeof fromSiblings === 'number' || typeof fromSiblings === 'string') {
    return fromSiblings
  }

  const fromData = dataRecord?.country
  if (typeof fromData === 'number' || typeof fromData === 'string') {
    return fromData
  }

  return undefined
}

const locationFilterOptions = ({
  siblingData,
  data,
}: {
  siblingData?: unknown
  data?: unknown
}) => {
  const countryId = getCountryId(siblingData, data)
  if (!countryId) {
    return true
  }

  return {
    country: {
      equals: countryId,
    },
  }
}

const adminOnly = ({ req: { user } }: { req: { user: { role?: string } | null } }) =>
  user?.role === 'admin'

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: 'Businesses',
    useAsTitle: 'name',
    defaultColumns: ['name', 'businessType', 'listingTier', 'verified', 'updatedAt'],
    components: {
      beforeList: ['@/components/admin/BusinessesImportTool'],
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic',
          fields: [
            {
              name: 'country',
              type: 'relationship',
              relationTo: 'countries',
              required: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'name',
              type: 'text',
              localized: true,
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              admin: {
                position: 'sidebar',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data, originalDoc }) => {
                    if (value) {
                      return value
                    }

                    const name = getNameForSlug(data?.name ?? originalDoc?.name)
                    if (!name) {
                      return value
                    }

                    return toKebabCase(name)
                  },
                ],
              },
              index: true,
              required: true,
              unique: true,
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'profileImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Additional gallery images for the profile page. These are shown in the hero gallery/slider.',
              },
            },
            {
              name: 'description',
              type: 'richText',
              localized: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              maxLength: 200,
            },
            {
              name: 'tagline',
              type: 'text',
              localized: true,
              maxLength: 150,
              admin: {
                description:
                  "A one-sentence pitch that appears below the firm name in the hero. E.g. 'Bangkok's leading immigration law specialists since 2005'",
              },
            },
            {
              name: 'responseTime',
              type: 'select',
              admin: {
                description: 'How quickly this firm typically responds to new inquiries',
              },
              options: [
                {
                  label: 'Within 1 hour',
                  value: 'within-1-hour',
                },
                {
                  label: 'Within 24 hours',
                  value: 'within-24-hours',
                },
                {
                  label: 'Within 48 hours',
                  value: 'within-48-hours',
                },
                {
                  label: 'Within 1 week',
                  value: 'within-1-week',
                },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              maxRows: 6,
              admin: {
                description:
                  "Key statistics or proof points displayed in the 'At a Glance' section",
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#HighlightRowLabel',
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'value',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'featuredOrder',
              type: 'number',
              min: 0,
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'website',
              type: 'text',
            },
            {
              name: 'address',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
            },
            {
              name: 'nearestTransit',
              type: 'text',
              admin: {
                description:
                  "Nearest BTS/MRT station or landmark. E.g. 'BTS Asok / MRT Sukhumvit (5 min walk)'",
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'foundingYear',
              type: 'number',
              min: 1800,
              max: 2100,
            },
            {
              name: 'companySize',
              type: 'select',
              options: ['1-5', '6-10', '11-25', '26-50', '51-100', '100+'],
            },
            {
              name: 'languages',
              type: 'relationship',
              relationTo: 'languages',
              hasMany: true,
            },
            {
              name: 'feeRangeMin',
              type: 'number',
              min: 0,
            },
            {
              name: 'feeRangeMax',
              type: 'number',
              min: 0,
            },
            {
              name: 'feeCurrency',
              type: 'relationship',
              relationTo: 'currencies',
            },
          ],
        },
        {
          label: 'Services & Fees',
          fields: [
            {
              name: 'hourlyFeeMin',
              label: 'Hourly fee from',
              type: 'number',
              min: 0,
            },
            {
              name: 'hourlyFeeMax',
              label: 'Hourly fee up to',
              type: 'number',
              min: 0,
            },
            {
              name: 'hourlyFeeCurrency',
              type: 'relationship',
              relationTo: 'currencies',
            },
            {
              name: 'hourlyFeeNote',
              type: 'text',
              admin: {
                description:
                  "Optional note shown with hourly fees. E.g. 'partner rate', 'blended team rate', 'minimum 2 hours'",
              },
            },
            {
              name: 'practiceAreaDetails',
              type: 'array',
              maxRows: 15,
              admin: {
                description:
                  'Define what your firm offers in each practice area, including specific services and pricing. This powers the main Services & Fees section on your profile.',
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#PracticeAreaDetailRowLabel',
                },
              },
              fields: [
                {
                  name: 'practiceArea',
                  type: 'relationship',
                  relationTo: 'practice-areas',
                  required: true,
                  admin: {
                    description: 'Select the practice area',
                  },
                },
                {
                  name: 'offeredServices',
                  type: 'relationship',
                  relationTo: 'services',
                  hasMany: true,
                  admin: {
                    description:
                      'Select the specific services your firm offers within this practice area. Users can click these services to find other firms offering the same service.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  maxLength: 500,
                  admin: {
                    description:
                      'Brief description of what your firm does in this area. 1-2 sentences.',
                  },
                },
                {
                  name: 'priceMin',
                  label: 'Starting price',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'priceMax',
                  label: 'Up to',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'priceCurrency',
                  type: 'relationship',
                  relationTo: 'currencies',
                },
                {
                  name: 'priceNote',
                  type: 'text',
                  admin: {
                    description:
                      "E.g. 'per hour', 'fixed fee', 'starting from', 'free initial consultation'",
                  },
                },
                {
                  name: 'services',
                  type: 'array',
                  admin: {
                    components: {
                      RowLabel: '@/collections/Businesses/RowLabels#PracticeAreaServiceRowLabel',
                    },
                  },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'price',
                      type: 'text',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      maxLength: 300,
                    },
                  ],
                },
              ],
            },
            {
              name: 'servicePricing',
              type: 'array',
              maxRows: 15,
              admin: {
                hidden: true,
              },
              fields: [
                {
                  name: 'serviceName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'priceMin',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'priceMax',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'priceNote',
                  type: 'text',
                },
                {
                  name: 'currency',
                  type: 'relationship',
                  relationTo: 'currencies',
                },
              ],
            },
            {
              name: 'services',
              type: 'array',
              admin: {
                hidden: true,
              },
              fields: [
                {
                  name: 'service',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Social Proof',
          fields: [
            {
              name: 'caseHighlights',
              type: 'array',
              maxRows: 6,
              admin: {
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#CaseHighlightRowLabel',
                },
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  maxLength: 300,
                },
                {
                  name: 'metric',
                  type: 'text',
                },
              ],
            },
            {
              name: 'testimonials',
              type: 'array',
              maxRows: 10,
              admin: {
                description:
                  "Client testimonials submitted by the firm. These will be marked as 'Provided by the firm' on the profile.",
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#TestimonialRowLabel',
                },
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  maxLength: 500,
                },
                {
                  name: 'authorName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'authorTitle',
                  type: 'text',
                },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              maxRows: 10,
              admin: {
                description:
                  'Frequently asked questions displayed on the profile. Great for SEO and user engagement.',
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#FAQRowLabel',
                },
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'practiceAreas',
              type: 'relationship',
              relationTo: 'practice-areas',
              hasMany: true,
            },
            {
              name: 'locations',
              type: 'relationship',
              relationTo: 'locations',
              hasMany: true,
              filterOptions: locationFilterOptions,
            },
            {
              name: 'primaryLocation',
              type: 'relationship',
              relationTo: 'locations',
              filterOptions: locationFilterOptions,
            },
          ],
        },
        {
          label: 'Office Locations',
          fields: [
            {
              name: 'officeLocations',
              type: 'array',
              label: 'Office Locations',
              admin: {
                description:
                  'Add multiple office locations with their specific details and opening hours',
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#OfficeLocationRowLabel',
                },
              },
              fields: [
                {
                  name: 'location',
                  type: 'relationship',
                  relationTo: 'locations',
                  required: true,
                  filterOptions: locationFilterOptions,
                  admin: {
                    description: 'Select the location for this office',
                  },
                },
                {
                  name: 'address',
                  type: 'textarea',
                  admin: {
                    description: 'Specific address for this office location',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    description: 'Location-specific phone number (optional)',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'Location-specific email (optional)',
                  },
                },
                {
                  name: 'googleMapsUrl',
                  type: 'text',
                  admin: {
                    description: 'Google Maps URL for this specific office',
                  },
                },
                {
                  name: 'nearestTransit',
                  type: 'text',
                  admin: {
                    description: 'Nearest BTS/MRT station or landmark for this office',
                  },
                },
                {
                  name: 'openingHours',
                  type: 'group',
                  label: 'Opening Hours',
                  fields: [
                    {
                      name: 'monday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'tuesday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'wednesday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'thursday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'friday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'saturday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                    {
                      name: 'sunday',
                      type: 'group',
                      fields: [
                        {
                          name: 'closed',
                          type: 'checkbox',
                          defaultValue: false,
                        },
                        {
                          name: 'openTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 09:00)',
                            placeholder: '09:00',
                          },
                        },
                        {
                          name: 'closeTime',
                          type: 'text',
                          admin: {
                            condition: (data) => !data?.closed,
                            description: 'Format: HH:MM (e.g., 17:00)',
                            placeholder: '17:00',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Team',
          fields: [
            {
              name: 'teamMembers',
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@/collections/Businesses/RowLabels#TeamMemberRowLabel',
                },
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'select',
                  options: [
                    'Founding Partner',
                    'Managing Partner',
                    'Senior Partner',
                    'Partner',
                    'Senior Associate',
                    'Associate',
                    'Of Counsel',
                    'Legal Consultant',
                  ],
                },
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'email',
                  type: 'email',
                },
                {
                  name: 'linkedIn',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'allOfferedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-populated from practice area details. Used for filtering.',
      },
    },
    {
      name: 'businessType',
      type: 'select',
      required: true,
      defaultValue: 'law-firm',
      options: [
        {
          label: 'Law Firm',
          value: 'law-firm',
        },
        {
          label: 'Lawyer',
          value: 'lawyer',
        },
        {
          label: 'Accounting Firm',
          value: 'accounting-firm',
        },
        {
          label: 'Accountant',
          value: 'accountant',
        },
      ],
      access: {
        create: adminOnly,
        read: adminOnly,
        update: adminOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'serviceCategories',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Legal',
          value: 'legal',
        },
        {
          label: 'Accounting',
          value: 'accounting',
        },
        {
          label: 'Visa Services',
          value: 'visa-services',
        },
        {
          label: 'Company Registration',
          value: 'company-registration',
        },
        {
          label: 'Tax',
          value: 'tax',
        },
        {
          label: 'Audit',
          value: 'audit',
        },
      ],
      access: {
        create: adminOnly,
        read: adminOnly,
        update: adminOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'claimToken',
      type: 'text',
      index: true,
      unique: true,
      access: {
        create: adminOnly,
        read: adminOnly,
        update: adminOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'claimTokenUsedAt',
      type: 'date',
      access: {
        create: adminOnly,
        read: adminOnly,
        update: adminOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'supabaseUserId',
      type: 'text',
      index: true,
      access: {
        create: adminOnly,
        read: adminOnly,
        update: adminOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'listingTier',
      type: 'select',
      defaultValue: 'free',
      admin: {
        position: 'sidebar',
        description:
          'Free = basic auto-listed. Bronze = verified claimed profile. Silver/Gold/Platinum = upgraded listing tiers.',
      },
      options: [
        {
          label: 'Free',
          value: 'free',
        },
        {
          label: 'Bronze',
          value: 'bronze',
        },
        {
          label: 'Silver',
          value: 'silver',
        },
        {
          label: 'Gold',
          value: 'gold',
        },
        {
          label: 'Platinum',
          value: 'platinum',
        },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  timestamps: true,
}
