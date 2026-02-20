import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Currencies: CollectionConfig = {
  slug: 'currencies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Platform Settings',
    useAsTitle: 'code',
    defaultColumns: ['code', 'name', 'symbol'],
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
      name: 'symbol',
      type: 'text',
      required: true,
    },
    {
      name: 'symbolPosition',
      type: 'select',
      defaultValue: 'before',
      options: [
        {
          label: 'Before',
          value: 'before',
        },
        {
          label: 'After',
          value: 'after',
        },
      ],
    },
  ],
  timestamps: true,
}
