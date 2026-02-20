import type { CollectionConfig } from 'payload'

import { toKebabCase } from '@/utilities/toKebabCase'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Law Firm Registry',
    useAsTitle: 'name',
    defaultColumns: ['name', 'practiceArea', 'slug', 'tier', 'updatedAt'],
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
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
    },
    {
      name: 'seoTitleTemplate',
      type: 'text',
    },
    {
      name: 'seoDescriptionTemplate',
      type: 'textarea',
      maxLength: 160,
    },
    {
      name: 'tier',
      type: 'select',
      defaultValue: 'primary',
      options: [
        {
          value: 'primary',
          label: 'Primary — shown prominently in firm profile',
        },
        {
          value: 'secondary',
          label: 'Secondary — shown in full service list',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
