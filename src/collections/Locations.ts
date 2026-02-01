import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Locations: CollectionConfig = {
  slug: 'locations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'featured', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'name',
    }),
    {
      name: 'region',
      type: 'select',
      options: ['Central', 'North', 'Northeast', 'East', 'South'],
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
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
