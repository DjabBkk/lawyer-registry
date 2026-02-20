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

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Platform Settings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'active', 'updatedAt'],
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
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'defaultCurrency',
      type: 'relationship',
      relationTo: 'currencies',
    },
    {
      name: 'defaultLanguage',
      type: 'relationship',
      relationTo: 'languages',
    },
    {
      name: 'flagEmoji',
      type: 'text',
    },
    {
      name: 'seoTitleTemplate',
      type: 'text',
      localized: true,
    },
    {
      name: 'seoDescriptionTemplate',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
    },
  ],
  timestamps: true,
}
