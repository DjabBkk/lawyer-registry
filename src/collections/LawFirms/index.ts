import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

const languageOptions = [
  'English',
  'Thai',
  'Chinese',
  'Japanese',
  'German',
  'French',
  'Spanish',
  'Russian',
  'Arabic',
]

export const LawFirms: CollectionConfig = {
  slug: 'law-firms',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'featured', 'updatedAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic',
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
              name: 'description',
              type: 'richText',
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 200,
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
            },
            {
              name: 'googleMapsUrl',
              type: 'text',
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
              type: 'select',
              hasMany: true,
              options: languageOptions,
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
              type: 'select',
              defaultValue: 'THB',
              options: ['THB', 'USD', 'EUR'],
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
            },
            {
              name: 'primaryLocation',
              type: 'relationship',
              relationTo: 'locations',
            },
          ],
        },
        {
          label: 'Team',
          fields: [
            {
              name: 'teamMembers',
              type: 'array',
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
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'array',
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
