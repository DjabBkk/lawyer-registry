import type { CollectionConfig } from 'payload'

import { toKebabCase } from '@/utilities/toKebabCase'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

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

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Law Firm Registry',
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'featured', 'updatedAt'],
  },
  fields: [
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
      name: 'region',
      type: 'select',
      options: ['Central', 'North', 'Northeast', 'East', 'South'],
      required: true,
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
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
    },
  ],
  timestamps: true,
}
