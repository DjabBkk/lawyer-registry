import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Languages: CollectionConfig = {
  slug: 'languages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Platform Settings',
    useAsTitle: 'name',
    defaultColumns: ['name', 'nativeName', 'code'],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'nativeName',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
