export type LocationSeed = {
  name: string
  countryName: string
  region: string
  locationType: 'city' | 'district' | 'province'
  parentName?: string | null
  zipCodes?: string
  shortDescription: string
  featured: boolean
  featuredOrder?: number
  seoTitle?: string
  seoDescription?: string
}

export const locations: LocationSeed[] = [
  {
    name: 'Bangkok',
    countryName: 'Thailand',
    region: 'Central',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Thailand’s capital and largest legal market.',
    featured: true,
    featuredOrder: 1,
    seoTitle: 'Law Firms in Bangkok',
    seoDescription: 'Top law firms and attorneys in Bangkok.',
  },
  {
    name: 'Pattaya',
    countryName: 'Thailand',
    region: 'East',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Commercial hub on the eastern seaboard.',
    featured: true,
    featuredOrder: 2,
    seoTitle: 'Law Firms in Pattaya',
    seoDescription: 'Find trusted lawyers and law firms in Pattaya.',
  },
  {
    name: 'Phuket',
    countryName: 'Thailand',
    region: 'South',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Island province with strong real estate activity.',
    featured: true,
    featuredOrder: 3,
    seoTitle: 'Law Firms in Phuket',
    seoDescription: 'Legal services and attorneys in Phuket.',
  },
  {
    name: 'Chiang Mai',
    countryName: 'Thailand',
    region: 'North',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Northern cultural center and business hub.',
    featured: true,
    featuredOrder: 4,
    seoTitle: 'Law Firms in Chiang Mai',
    seoDescription: 'Find lawyers and law firms in Chiang Mai.',
  },
  {
    name: 'Hua Hin',
    countryName: 'Thailand',
    region: 'Central',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Resort city with growing legal demand.',
    featured: false,
    seoTitle: 'Law Firms in Hua Hin',
    seoDescription: 'Legal services in Hua Hin and nearby areas.',
  },
  {
    name: 'Koh Samui',
    countryName: 'Thailand',
    region: 'South',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Island destination with international clients.',
    featured: false,
    seoTitle: 'Law Firms in Koh Samui',
    seoDescription: 'Law firms serving Koh Samui residents and expats.',
  },
  {
    name: 'Krabi',
    countryName: 'Thailand',
    region: 'South',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Popular tourist region with property activity.',
    featured: false,
    seoTitle: 'Law Firms in Krabi',
    seoDescription: 'Legal support and law firms in Krabi.',
  },
  {
    name: 'Chiang Rai',
    countryName: 'Thailand',
    region: 'North',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Northern province with cross-border commerce.',
    featured: false,
    seoTitle: 'Law Firms in Chiang Rai',
    seoDescription: 'Find legal services and attorneys in Chiang Rai.',
  },
  {
    name: 'Udon Thani',
    countryName: 'Thailand',
    region: 'Northeast',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Growing hub for business and property law.',
    featured: false,
    seoTitle: 'Law Firms in Udon Thani',
    seoDescription: 'Law firms and lawyers in Udon Thani.',
  },
  {
    name: 'Khon Kaen',
    countryName: 'Thailand',
    region: 'Northeast',
    locationType: 'city',
    parentName: null,
    shortDescription: 'Major northeastern city with diverse legal needs.',
    featured: false,
    seoTitle: 'Law Firms in Khon Kaen',
    seoDescription: 'Legal services in Khon Kaen and Isan.',
  },
]
