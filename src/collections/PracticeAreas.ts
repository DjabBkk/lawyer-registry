import type { CollectionConfig } from 'payload'

import { toKebabCase } from '@/utilities/toKebabCase'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Law Firm Registry',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
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

            const name = data?.name ?? originalDoc?.name
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'icon',
      type: 'text',
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
    },
    {
      name: 'seoDescription',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
