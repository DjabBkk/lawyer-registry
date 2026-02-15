export type LocationSeed = {
  name: string
  region: 'Central' | 'North' | 'Northeast' | 'East' | 'South'
  shortDescription: string
  featured: boolean
  featuredOrder?: number
  seoTitle?: string
  seoDescription?: string
}

export const locations: LocationSeed[] = [
  {
    name: 'Bangkok',
    region: 'Central',
    shortDescription: 'Thailand’s capital and largest legal market.',
    featured: true,
    featuredOrder: 1,
    seoTitle: 'Law Firms in Bangkok',
    seoDescription: 'Top law firms and attorneys in Bangkok.',
  },
  {
    name: 'Pattaya',
    region: 'East',
    shortDescription: 'Commercial hub on the eastern seaboard.',
    featured: true,
    featuredOrder: 2,
    seoTitle: 'Law Firms in Pattaya',
    seoDescription: 'Find trusted lawyers and law firms in Pattaya.',
  },
  {
    name: 'Phuket',
    region: 'South',
    shortDescription: 'Island province with strong real estate activity.',
    featured: true,
    featuredOrder: 3,
    seoTitle: 'Law Firms in Phuket',
    seoDescription: 'Legal services and attorneys in Phuket.',
  },
  {
    name: 'Chiang Mai',
    region: 'North',
    shortDescription: 'Northern cultural center and business hub.',
    featured: true,
    featuredOrder: 4,
    seoTitle: 'Law Firms in Chiang Mai',
    seoDescription: 'Find lawyers and law firms in Chiang Mai.',
  },
  {
    name: 'Hua Hin',
    region: 'Central',
    shortDescription: 'Resort city with growing legal demand.',
    featured: false,
    seoTitle: 'Law Firms in Hua Hin',
    seoDescription: 'Legal services in Hua Hin and nearby areas.',
  },
  {
    name: 'Koh Samui',
    region: 'South',
    shortDescription: 'Island destination with international clients.',
    featured: false,
    seoTitle: 'Law Firms in Koh Samui',
    seoDescription: 'Law firms serving Koh Samui residents and expats.',
  },
  {
    name: 'Krabi',
    region: 'South',
    shortDescription: 'Popular tourist region with property activity.',
    featured: false,
    seoTitle: 'Law Firms in Krabi',
    seoDescription: 'Legal support and law firms in Krabi.',
  },
  {
    name: 'Chiang Rai',
    region: 'North',
    shortDescription: 'Northern province with cross-border commerce.',
    featured: false,
    seoTitle: 'Law Firms in Chiang Rai',
    seoDescription: 'Find legal services and attorneys in Chiang Rai.',
  },
  {
    name: 'Udon Thani',
    region: 'Northeast',
    shortDescription: 'Growing hub for business and property law.',
    featured: false,
    seoTitle: 'Law Firms in Udon Thani',
    seoDescription: 'Law firms and lawyers in Udon Thani.',
  },
  {
    name: 'Khon Kaen',
    region: 'Northeast',
    shortDescription: 'Major northeastern city with diverse legal needs.',
    featured: false,
    seoTitle: 'Law Firms in Khon Kaen',
    seoDescription: 'Legal services in Khon Kaen and Isan.',
  },
]
