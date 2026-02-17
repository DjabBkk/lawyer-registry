type OpeningDay = {
  closed: boolean
  openTime?: string
  closeTime?: string
}

type SupportedLanguage =
  | 'English'
  | 'Thai'
  | 'Chinese'
  | 'Japanese'
  | 'German'
  | 'French'
  | 'Spanish'
  | 'Russian'
  | 'Arabic'

type ResponseTime =
  | 'within-1-hour'
  | 'within-24-hours'
  | 'within-48-hours'
  | 'within-1-week'

type ListingTier = 'free' | 'claimed' | 'premium'

type OpeningHours = {
  monday: OpeningDay
  tuesday: OpeningDay
  wednesday: OpeningDay
  thursday: OpeningDay
  friday: OpeningDay
  saturday: OpeningDay
  sunday: OpeningDay
}

export type LawFirmSeed = {
  name: string
  email: string
  phone?: string
  website?: string
  address?: string
  googleMapsUrl?: string
  shortDescription?: string
  description?: string
  featured?: boolean
  featuredOrder?: number
  listingTier?: ListingTier
  verified?: boolean
  foundingYear?: number
  companySize?: '1-5' | '6-10' | '11-25' | '26-50' | '51-100' | '100+'
  languages?: SupportedLanguage[]
  feeRangeMin?: number
  feeRangeMax?: number
  feeCurrency?: 'THB' | 'USD' | 'EUR'
  hourlyFeeMin?: number
  hourlyFeeMax?: number
  hourlyFeeCurrency?: 'THB' | 'USD' | 'EUR'
  hourlyFeeNote?: string
  responseTime?: ResponseTime
  nearestTransit?: string
  tagline?: string
  highlights?: Array<{
    label: string
    value: string
  }>
  practiceAreaDetails?: Array<{
    practiceArea: string
    description?: string
    priceMin?: number
    priceMax?: number
    priceCurrency?: 'THB' | 'USD' | 'EUR'
    priceNote?: string
    services?: Array<{
      name: string
      price?: string
      description?: string
    }>
  }>
  servicePricing?: Array<{
    serviceName: string
    priceMin?: number
    priceMax?: number
    priceNote?: string
    currency?: 'THB' | 'USD' | 'EUR'
  }>
  caseHighlights?: Array<{
    title: string
    description: string
    metric?: string
  }>
  testimonials?: Array<{
    quote: string
    authorName: string
    authorTitle?: string
    rating?: 1 | 2 | 3 | 4 | 5
  }>
  faq?: Array<{
    question: string
    answer: string
  }>
  practiceAreas: string[]
  locations: string[]
  primaryLocation: string
  officeLocations?: Array<{
    location: string
    address?: string
    phone?: string
    email?: string
    googleMapsUrl?: string
    nearestTransit?: string
    openingHours?: OpeningHours
  }>
  teamMembers?: Array<{
    name: string
    role:
      | 'Founding Partner'
      | 'Managing Partner'
      | 'Senior Partner'
      | 'Partner'
      | 'Senior Associate'
      | 'Associate'
      | 'Of Counsel'
      | 'Legal Consultant'
    bio?: string
    email?: string
    linkedIn?: string
  }>
  services?: Array<{ service: string }>
}

const weekdayHours: OpeningHours = {
  monday: { closed: false, openTime: '09:00', closeTime: '17:00' },
  tuesday: { closed: false, openTime: '09:00', closeTime: '17:00' },
  wednesday: { closed: false, openTime: '09:00', closeTime: '17:00' },
  thursday: { closed: false, openTime: '09:00', closeTime: '17:00' },
  friday: { closed: false, openTime: '09:00', closeTime: '17:00' },
  saturday: { closed: true },
  sunday: { closed: true },
}

const extendedHours: OpeningHours = {
  monday: { closed: false, openTime: '08:30', closeTime: '18:00' },
  tuesday: { closed: false, openTime: '08:30', closeTime: '18:00' },
  wednesday: { closed: false, openTime: '08:30', closeTime: '18:00' },
  thursday: { closed: false, openTime: '08:30', closeTime: '18:00' },
  friday: { closed: false, openTime: '08:30', closeTime: '18:00' },
  saturday: { closed: false, openTime: '10:00', closeTime: '14:00' },
  sunday: { closed: true },
}

export const lawFirms: LawFirmSeed[] = [
  {
    name: 'Bangkok Legal Partners',
    email: 'contact@bangkoklegalpartners.com',
    phone: '+66 2 555 0101',
    website: 'https://bangkoklegalpartners.com',
    address: 'Silom Road, Bang Rak, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Legal+Partners',
    shortDescription: 'Full-service firm with deep Bangkok market experience.',
    featured: true,
    featuredOrder: 1,
    foundingYear: 2002,
    companySize: '26-50',
    languages: ['English', 'Thai'],
    feeRangeMin: 5000,
    feeRangeMax: 30000,
    feeCurrency: 'THB',
    practiceAreas: ['Corporate Law', 'Tax Law', 'Real Estate Law', 'Employment Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Silom Road, Bang Rak, Bangkok',
        phone: '+66 2 555 0101',
        email: 'bangkok@bangkoklegalpartners.com',
        googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Legal+Partners',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Kanya Wattanapan',
        role: 'Managing Partner',
        bio: 'Corporate and M&A specialist with 18 years of experience.',
        email: 'kanya@bangkoklegalpartners.com',
      },
      {
        name: 'Michael Harper',
        role: 'Senior Partner',
        bio: 'Advises multinational clients on Thailand market entry.',
        email: 'michael@bangkoklegalpartners.com',
      },
    ],
    services: [
      { service: 'Company incorporation' },
      { service: 'Corporate restructuring' },
      { service: 'Employment compliance audits' },
    ],
  },
  {
    name: 'Siam Heritage Law',
    email: 'hello@siamheritagelaw.co.th',
    phone: '+66 2 555 0112',
    website: 'https://siamheritagelaw.co.th',
    address: 'Sukhumvit Road, Khlong Toei, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Siam+Heritage+Law',
    shortDescription: 'Boutique firm focusing on family and estate matters.',
    featured: true,
    featuredOrder: 2,
    foundingYear: 2010,
    companySize: '11-25',
    languages: ['English', 'Thai'],
    feeRangeMin: 3000,
    feeRangeMax: 20000,
    feeCurrency: 'THB',
    practiceAreas: ['Family Law', 'Wills & Estate Planning', 'Contract Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Sukhumvit Road, Khlong Toei, Bangkok',
        phone: '+66 2 555 0112',
        email: 'bangkok@siamheritagelaw.co.th',
        googleMapsUrl: 'https://maps.google.com/?q=Siam+Heritage+Law',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Anong Prasert',
        role: 'Founding Partner',
        bio: 'Family law counselor with a focus on cross-border estates.',
        email: 'anong@siamheritagelaw.co.th',
      },
      {
        name: 'Supakorn Chai',
        role: 'Senior Associate',
        bio: 'Specialist in wills and probate matters.',
        email: 'supakorn@siamheritagelaw.co.th',
      },
    ],
    services: [
      { service: 'Divorce and custody representation' },
      { service: 'Estate planning and wills' },
      { service: 'Prenuptial agreements' },
    ],
  },
  {
    name: 'Phuket Coastal Attorneys',
    email: 'info@phuketcoastallaw.com',
    phone: '+66 76 555 0201',
    website: 'https://phuketcoastallaw.com',
    address: 'Patong Beach Road, Phuket',
    googleMapsUrl: 'https://maps.google.com/?q=Phuket+Coastal+Attorneys',
    shortDescription: 'Real estate and immigration specialists in Phuket.',
    featured: true,
    featuredOrder: 3,
    foundingYear: 2008,
    companySize: '6-10',
    languages: ['English', 'Thai', 'Russian'],
    feeRangeMin: 4000,
    feeRangeMax: 25000,
    feeCurrency: 'THB',
    practiceAreas: ['Real Estate Law', 'Immigration Law', 'Contract Law'],
    locations: ['Phuket'],
    primaryLocation: 'Phuket',
    officeLocations: [
      {
        location: 'Phuket',
        address: 'Patong Beach Road, Phuket',
        phone: '+66 76 555 0201',
        email: 'phuket@phuketcoastallaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Phuket+Coastal+Attorneys',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Narin Suthep',
        role: 'Managing Partner',
        bio: 'Advises foreign investors on property acquisitions.',
        email: 'narin@phuketcoastallaw.com',
      },
      {
        name: 'Elena Petrova',
        role: 'Of Counsel',
        bio: 'Immigration and residency expert for CIS clients.',
        email: 'elena@phuketcoastallaw.com',
      },
    ],
    services: [
      { service: 'Property due diligence' },
      { service: 'Visa and work permit processing' },
      { service: 'Lease drafting and negotiation' },
    ],
  },
  {
    name: 'Northern Insight Legal',
    email: 'contact@northerninsightlaw.com',
    phone: '+66 53 555 0301',
    website: 'https://northerninsightlaw.com',
    address: 'Nimmanhaemin Road, Chiang Mai',
    googleMapsUrl: 'https://maps.google.com/?q=Northern+Insight+Legal',
    shortDescription: 'Regional firm supporting SMEs and expat families.',
    featured: false,
    foundingYear: 2012,
    companySize: '6-10',
    languages: ['English', 'Thai', 'Chinese'],
    feeRangeMin: 2500,
    feeRangeMax: 15000,
    feeCurrency: 'THB',
    practiceAreas: ['Corporate Law', 'Family Law', 'Immigration Law'],
    locations: ['Chiang Mai'],
    primaryLocation: 'Chiang Mai',
    officeLocations: [
      {
        location: 'Chiang Mai',
        address: 'Nimmanhaemin Road, Chiang Mai',
        phone: '+66 53 555 0301',
        email: 'chiangmai@northerninsightlaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Northern+Insight+Legal',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Somchai Lertchai',
        role: 'Senior Partner',
        bio: 'Corporate advisor for northern region entrepreneurs.',
        email: 'somchai@northerninsightlaw.com',
      },
      {
        name: 'Grace Lin',
        role: 'Associate',
        bio: 'Supports immigration and family law matters.',
        email: 'grace@northerninsightlaw.com',
      },
    ],
    services: [
      { service: 'SME incorporation' },
      { service: 'Visa renewals and compliance' },
      { service: 'Contract review' },
    ],
  },
  {
    name: 'Eastern Seaboard Counsel',
    email: 'team@easternseaboardcounsel.com',
    phone: '+66 38 555 0401',
    website: 'https://easternseaboardcounsel.com',
    address: 'Central Pattaya, Chonburi',
    googleMapsUrl: 'https://maps.google.com/?q=Eastern+Seaboard+Counsel',
    shortDescription: 'Corporate, labor, and logistics legal support.',
    featured: false,
    foundingYear: 2005,
    companySize: '11-25',
    languages: ['English', 'Thai'],
    feeRangeMin: 4000,
    feeRangeMax: 28000,
    feeCurrency: 'THB',
    practiceAreas: ['Corporate Law', 'Employment Law', 'International Trade'],
    locations: ['Pattaya'],
    primaryLocation: 'Pattaya',
    officeLocations: [
      {
        location: 'Pattaya',
        address: 'Central Pattaya, Chonburi',
        phone: '+66 38 555 0401',
        email: 'pattaya@easternseaboardcounsel.com',
        googleMapsUrl: 'https://maps.google.com/?q=Eastern+Seaboard+Counsel',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Preecha Nimit',
        role: 'Managing Partner',
        bio: 'Leads employment and trade advisory for industrial clients.',
        email: 'preecha@easternseaboardcounsel.com',
      },
      {
        name: 'Jenna Miller',
        role: 'Senior Associate',
        bio: 'Focuses on supply chain contracts and compliance.',
        email: 'jenna@easternseaboardcounsel.com',
      },
    ],
    services: [
      { service: 'Employment dispute resolution' },
      { service: 'Trade compliance reviews' },
      { service: 'Commercial contract drafting' },
    ],
  },
  {
    name: 'Samui Island Legal',
    email: 'info@samuilegal.co.th',
    phone: '+66 77 555 0501',
    website: 'https://samuilegal.co.th',
    address: 'Bophut, Koh Samui',
    googleMapsUrl: 'https://maps.google.com/?q=Samui+Island+Legal',
    shortDescription: 'Property and hospitality law for island businesses.',
    featured: false,
    foundingYear: 2014,
    companySize: '1-5',
    languages: ['English', 'Thai', 'German'],
    feeRangeMin: 3000,
    feeRangeMax: 18000,
    feeCurrency: 'THB',
    practiceAreas: ['Real Estate Law', 'Contract Law', 'Immigration Law'],
    locations: ['Koh Samui'],
    primaryLocation: 'Koh Samui',
    officeLocations: [
      {
        location: 'Koh Samui',
        address: 'Bophut, Koh Samui',
        phone: '+66 77 555 0501',
        email: 'samui@samuilegal.co.th',
        googleMapsUrl: 'https://maps.google.com/?q=Samui+Island+Legal',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Phanida Rojan',
        role: 'Founding Partner',
        bio: 'Hospitality and property law specialist.',
        email: 'phanida@samuilegal.co.th',
      },
      {
        name: 'Thomas Richter',
        role: 'Legal Consultant',
        bio: 'Advises German-speaking clients on property matters.',
        email: 'thomas@samuilegal.co.th',
      },
    ],
    services: [
      { service: 'Hospitality contract review' },
      { service: 'Land lease advisory' },
      { service: 'Work permit processing' },
    ],
  },
  {
    name: 'Krabi Maritime & Trade Law',
    email: 'contact@krabimaritime.com',
    phone: '+66 75 555 0601',
    website: 'https://krabimaritime.com',
    address: 'Ao Nang, Krabi',
    googleMapsUrl: 'https://maps.google.com/?q=Krabi+Maritime+Law',
    shortDescription: 'Maritime and logistics counsel for southern Thailand.',
    featured: false,
    foundingYear: 2007,
    companySize: '6-10',
    languages: ['English', 'Thai'],
    feeRangeMin: 3500,
    feeRangeMax: 22000,
    feeCurrency: 'THB',
    practiceAreas: ['Maritime Law', 'International Trade', 'Insurance Law'],
    locations: ['Krabi', 'Phuket'],
    primaryLocation: 'Krabi',
    officeLocations: [
      {
        location: 'Krabi',
        address: 'Ao Nang, Krabi',
        phone: '+66 75 555 0601',
        email: 'krabi@krabimaritime.com',
        googleMapsUrl: 'https://maps.google.com/?q=Krabi+Maritime+Law',
        openingHours: weekdayHours,
      },
      {
        location: 'Phuket',
        address: 'Phuket Marina District',
        phone: '+66 76 555 0602',
        email: 'phuket@krabimaritime.com',
        googleMapsUrl: 'https://maps.google.com/?q=Krabi+Maritime+Law+Phuket',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Suriya Kaew',
        role: 'Senior Partner',
        bio: 'Maritime disputes and shipping compliance expert.',
        email: 'suriya@krabimaritime.com',
      },
      {
        name: 'Marina Costa',
        role: 'Associate',
        bio: 'Handles maritime contracts and insurance claims.',
        email: 'marina@krabimaritime.com',
      },
    ],
    services: [
      { service: 'Shipping contract drafting' },
      { service: 'Port authority compliance' },
      { service: 'Cargo claim support' },
    ],
  },
  {
    name: 'Isan Growth Legal',
    email: 'hello@isangrowthlegal.com',
    phone: '+66 42 555 0701',
    website: 'https://isangrowthlegal.com',
    address: 'Downtown Udon Thani',
    googleMapsUrl: 'https://maps.google.com/?q=Isan+Growth+Legal',
    shortDescription: 'Regional counsel for SMEs and agricultural enterprises.',
    featured: false,
    foundingYear: 2016,
    companySize: '1-5',
    languages: ['English', 'Thai'],
    feeRangeMin: 2000,
    feeRangeMax: 12000,
    feeCurrency: 'THB',
    practiceAreas: ['Contract Law', 'Corporate Law', 'Tax Law'],
    locations: ['Udon Thani', 'Khon Kaen'],
    primaryLocation: 'Udon Thani',
    officeLocations: [
      {
        location: 'Udon Thani',
        address: 'Downtown Udon Thani',
        phone: '+66 42 555 0701',
        email: 'udon@isangrowthlegal.com',
        googleMapsUrl: 'https://maps.google.com/?q=Isan+Growth+Legal',
        openingHours: weekdayHours,
      },
      {
        location: 'Khon Kaen',
        address: 'Mittraphap Road, Khon Kaen',
        phone: '+66 43 555 0702',
        email: 'khonkaen@isangrowthlegal.com',
        googleMapsUrl: 'https://maps.google.com/?q=Isan+Growth+Legal+Khon+Kaen',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Wanchai Pattan',
        role: 'Founding Partner',
        bio: 'Specialist in SME growth and tax planning.',
        email: 'wanchai@isangrowthlegal.com',
      },
      {
        name: 'Rina Sato',
        role: 'Associate',
        bio: 'Contract and corporate compliance advisor.',
        email: 'rina@isangrowthlegal.com',
      },
    ],
    services: [
      { service: 'SME advisory retainer' },
      { service: 'Tax compliance review' },
      { service: 'Commercial agreement drafting' },
    ],
  },
  {
    name: 'Chiang Rai Cross-Border Law',
    email: 'info@chiangraicrossborder.com',
    phone: '+66 53 555 0801',
    website: 'https://chiangraicrossborder.com',
    address: 'Mae Sai District, Chiang Rai',
    googleMapsUrl: 'https://maps.google.com/?q=Chiang+Rai+Cross+Border+Law',
    shortDescription: 'Trade and immigration support for border enterprises.',
    featured: false,
    foundingYear: 2011,
    companySize: '6-10',
    languages: ['English', 'Thai', 'Chinese'],
    feeRangeMin: 3000,
    feeRangeMax: 17000,
    feeCurrency: 'THB',
    practiceAreas: ['International Trade', 'Immigration Law', 'Contract Law'],
    locations: ['Chiang Rai', 'Chiang Mai'],
    primaryLocation: 'Chiang Rai',
    officeLocations: [
      {
        location: 'Chiang Rai',
        address: 'Mae Sai District, Chiang Rai',
        phone: '+66 53 555 0801',
        email: 'chiangrai@chiangraicrossborder.com',
        googleMapsUrl: 'https://maps.google.com/?q=Chiang+Rai+Cross+Border+Law',
        openingHours: weekdayHours,
      },
      {
        location: 'Chiang Mai',
        address: 'Nimmanhaemin Road, Chiang Mai',
        phone: '+66 53 555 0802',
        email: 'chiangmai@chiangraicrossborder.com',
        googleMapsUrl: 'https://maps.google.com/?q=Chiang+Rai+Cross+Border+Law+Chiang+Mai',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Chanida Nual',
        role: 'Managing Partner',
        bio: 'Cross-border trade and customs compliance specialist.',
        email: 'chanida@chiangraicrossborder.com',
      },
      {
        name: 'Wei Zhang',
        role: 'Legal Consultant',
        bio: 'Advises Chinese clients on Thailand market entry.',
        email: 'wei@chiangraicrossborder.com',
      },
    ],
    services: [
      { service: 'Customs compliance' },
      { service: 'Cross-border contract review' },
      { service: 'Business visa support' },
    ],
  },
  {
    name: 'Hua Hin Property Counsel',
    email: 'contact@huahinpropertylaw.com',
    phone: '+66 32 555 0901',
    website: 'https://huahinpropertylaw.com',
    address: 'Phetkasem Road, Hua Hin',
    googleMapsUrl: 'https://maps.google.com/?q=Hua+Hin+Property+Counsel',
    shortDescription: 'Property and resort development counsel in Hua Hin.',
    featured: false,
    foundingYear: 2013,
    companySize: '1-5',
    languages: ['English', 'Thai', 'French'],
    feeRangeMin: 3500,
    feeRangeMax: 20000,
    feeCurrency: 'THB',
    practiceAreas: ['Real Estate Law', 'Construction Law', 'Contract Law'],
    locations: ['Hua Hin', 'Bangkok'],
    primaryLocation: 'Hua Hin',
    officeLocations: [
      {
        location: 'Hua Hin',
        address: 'Phetkasem Road, Hua Hin',
        phone: '+66 32 555 0901',
        email: 'huahin@huahinpropertylaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Hua+Hin+Property+Counsel',
        openingHours: weekdayHours,
      },
      {
        location: 'Bangkok',
        address: 'Sathorn Road, Bangkok',
        phone: '+66 2 555 0902',
        email: 'bangkok@huahinpropertylaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Hua+Hin+Property+Counsel+Bangkok',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Nattapong Saetang',
        role: 'Senior Partner',
        bio: 'Construction and property development advisor.',
        email: 'nattapong@huahinpropertylaw.com',
      },
      {
        name: 'Claire Dubois',
        role: 'Associate',
        bio: 'Supports resort and hospitality transactions.',
        email: 'claire@huahinpropertylaw.com',
      },
    ],
    services: [
      { service: 'Property purchase due diligence' },
      { service: 'Construction contract review' },
      { service: 'Lease negotiation support' },
    ],
  },
  {
    name: 'Bangkok Arbitration Chambers',
    email: 'contact@bkkarbitration.com',
    phone: '+66 2 555 1001',
    website: 'https://bkkarbitration.com',
    address: 'Asok, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Arbitration+Chambers',
    shortDescription: 'Dispute resolution specialists for complex matters.',
    featured: false,
    foundingYear: 2001,
    companySize: '11-25',
    languages: ['English', 'Thai', 'Japanese'],
    feeRangeMin: 8000,
    feeRangeMax: 40000,
    feeCurrency: 'THB',
    practiceAreas: ['Arbitration & Mediation', 'Contract Law', 'Corporate Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Asok, Bangkok',
        phone: '+66 2 555 1001',
        email: 'bangkok@bkkarbitration.com',
        googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Arbitration+Chambers',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Hiroshi Tanaka',
        role: 'Senior Partner',
        bio: 'International arbitration and mediation specialist.',
        email: 'hiroshi@bkkarbitration.com',
      },
      {
        name: 'Chalida Khum',
        role: 'Partner',
        bio: 'Leads Thai commercial dispute resolution.',
        email: 'chalida@bkkarbitration.com',
      },
    ],
    services: [
      { service: 'Arbitration proceedings' },
      { service: 'Mediation facilitation' },
      { service: 'Dispute risk assessment' },
    ],
  },
  {
    name: 'Premier Immigration Advisors',
    email: 'support@premierimmigration.co.th',
    phone: '+66 2 555 1101',
    website: 'https://premierimmigration.co.th',
    address: 'Phrom Phong, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Premier+Immigration+Advisors',
    shortDescription: 'Visa and residency specialists for professionals.',
    featured: true,
    featuredOrder: 4,
    foundingYear: 2015,
    companySize: '6-10',
    languages: ['English', 'Thai', 'Chinese', 'Japanese'],
    feeRangeMin: 5000,
    feeRangeMax: 25000,
    feeCurrency: 'THB',
    practiceAreas: ['Immigration Law', 'Employment Law', 'Contract Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Phrom Phong, Bangkok',
        phone: '+66 2 555 1101',
        email: 'bangkok@premierimmigration.co.th',
        googleMapsUrl: 'https://maps.google.com/?q=Premier+Immigration+Advisors',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Pimchanok Siri',
        role: 'Founding Partner',
        bio: 'Immigration and work permit specialist.',
        email: 'pimchanok@premierimmigration.co.th',
      },
      {
        name: 'Kenji Ito',
        role: 'Legal Consultant',
        bio: 'Advises Japanese corporate clients on visas.',
        email: 'kenji@premierimmigration.co.th',
      },
    ],
    services: [
      { service: 'Work permit applications' },
      { service: 'Business visa extensions' },
      { service: 'Immigration compliance' },
    ],
  },
  {
    name: 'Bangkok Cyber Law Group',
    email: 'contact@bkkcyberlaw.com',
    phone: '+66 2 555 1201',
    website: 'https://bkkcyberlaw.com',
    address: 'Rama 9 Road, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Cyber+Law+Group',
    shortDescription: 'Data privacy and cybersecurity advisory firm.',
    featured: false,
    foundingYear: 2018,
    companySize: '6-10',
    languages: ['English', 'Thai'],
    feeRangeMin: 6000,
    feeRangeMax: 35000,
    feeCurrency: 'THB',
    practiceAreas: ['Cybersecurity & Data Privacy', 'Corporate Law', 'Contract Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Rama 9 Road, Bangkok',
        phone: '+66 2 555 1201',
        email: 'bangkok@bkkcyberlaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Cyber+Law+Group',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Sasithorn Mek',
        role: 'Managing Partner',
        bio: 'Leads privacy compliance and incident response.',
        email: 'sasithorn@bkkcyberlaw.com',
      },
      {
        name: 'Alex Green',
        role: 'Senior Associate',
        bio: 'Advises on cybersecurity governance.',
        email: 'alex@bkkcyberlaw.com',
      },
    ],
    services: [
      { service: 'Data privacy assessments' },
      { service: 'Cyber incident response planning' },
      { service: 'Vendor risk contracts' },
    ],
  },
  {
    name: 'Golden Triangle Corporate',
    email: 'info@goldentrianglecorp.com',
    phone: '+66 2 555 1301',
    website: 'https://goldentrianglecorp.com',
    address: 'Wireless Road, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Golden+Triangle+Corporate',
    shortDescription: 'Corporate and M&A advisory for multinational clients.',
    featured: true,
    featuredOrder: 5,
    foundingYear: 1998,
    companySize: '51-100',
    languages: ['English', 'Thai', 'Japanese', 'Chinese'],
    feeRangeMin: 10000,
    feeRangeMax: 50000,
    feeCurrency: 'THB',
    practiceAreas: ['Corporate Law', 'Mergers & Acquisitions', 'Tax Law', 'Banking & Finance'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Wireless Road, Bangkok',
        phone: '+66 2 555 1301',
        email: 'bangkok@goldentrianglecorp.com',
        googleMapsUrl: 'https://maps.google.com/?q=Golden+Triangle+Corporate',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Prasit Wong',
        role: 'Senior Partner',
        bio: 'Leads M&A and investment advisory.',
        email: 'prasit@goldentrianglecorp.com',
      },
      {
        name: 'Nadia Al-Sayed',
        role: 'Partner',
        bio: 'Specialist in banking and finance transactions.',
        email: 'nadia@goldentrianglecorp.com',
      },
      {
        name: 'Arthit Kaew',
        role: 'Senior Associate',
        bio: 'Supports corporate structuring projects.',
        email: 'arthit@goldentrianglecorp.com',
      },
    ],
    services: [
      { service: 'M&A due diligence' },
      { service: 'Corporate finance advisory' },
      { service: 'Tax structuring' },
    ],
  },
  {
    name: 'Pattaya Litigation Center',
    email: 'contact@pattayalitigation.com',
    phone: '+66 38 555 1401',
    website: 'https://pattayalitigation.com',
    address: 'North Pattaya Road, Pattaya',
    googleMapsUrl: 'https://maps.google.com/?q=Pattaya+Litigation+Center',
    shortDescription: 'Criminal and civil litigation specialists.',
    featured: false,
    foundingYear: 2009,
    companySize: '6-10',
    languages: ['English', 'Thai'],
    feeRangeMin: 4000,
    feeRangeMax: 28000,
    feeCurrency: 'THB',
    practiceAreas: ['Criminal Law', 'Personal Injury', 'Contract Law'],
    locations: ['Pattaya', 'Bangkok'],
    primaryLocation: 'Pattaya',
    officeLocations: [
      {
        location: 'Pattaya',
        address: 'North Pattaya Road, Pattaya',
        phone: '+66 38 555 1401',
        email: 'pattaya@pattayalitigation.com',
        googleMapsUrl: 'https://maps.google.com/?q=Pattaya+Litigation+Center',
        openingHours: weekdayHours,
      },
      {
        location: 'Bangkok',
        address: 'Ratchada Road, Bangkok',
        phone: '+66 2 555 1402',
        email: 'bangkok@pattayalitigation.com',
        googleMapsUrl: 'https://maps.google.com/?q=Pattaya+Litigation+Center+Bangkok',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Teerapong Anan',
        role: 'Senior Partner',
        bio: 'Criminal defense and trial strategy expert.',
        email: 'teerapong@pattayalitigation.com',
      },
      {
        name: 'Jessica Lee',
        role: 'Associate',
        bio: 'Focuses on civil litigation and personal injury.',
        email: 'jessica@pattayalitigation.com',
      },
    ],
    services: [
      { service: 'Criminal defense representation' },
      { service: 'Personal injury claims' },
      { service: 'Civil litigation support' },
    ],
  },
  {
    name: 'Phuket Hospitality Legal',
    email: 'hello@phukethospitalitylaw.com',
    phone: '+66 76 555 1501',
    website: 'https://phukethospitalitylaw.com',
    address: 'Karon Beach, Phuket',
    googleMapsUrl: 'https://maps.google.com/?q=Phuket+Hospitality+Legal',
    shortDescription: 'Hospitality, entertainment, and licensing experts.',
    featured: false,
    foundingYear: 2012,
    companySize: '6-10',
    languages: ['English', 'Thai', 'German'],
    feeRangeMin: 5000,
    feeRangeMax: 24000,
    feeCurrency: 'THB',
    practiceAreas: ['Entertainment Law', 'Contract Law', 'Insurance Law'],
    locations: ['Phuket'],
    primaryLocation: 'Phuket',
    officeLocations: [
      {
        location: 'Phuket',
        address: 'Karon Beach, Phuket',
        phone: '+66 76 555 1501',
        email: 'phuket@phukethospitalitylaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Phuket+Hospitality+Legal',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Lalita Pradit',
        role: 'Partner',
        bio: 'Hospitality licensing and entertainment counsel.',
        email: 'lalita@phukethospitalitylaw.com',
      },
      {
        name: 'Markus Schmidt',
        role: 'Legal Consultant',
        bio: 'Advises European hospitality clients.',
        email: 'markus@phukethospitalitylaw.com',
      },
    ],
    services: [
      { service: 'Hotel licensing support' },
      { service: 'Entertainment contract drafting' },
      { service: 'Insurance claims assistance' },
    ],
  },
  {
    name: 'Chiang Mai Family Advocates',
    email: 'info@chiangmaifamilyadvocates.com',
    phone: '+66 53 555 1601',
    website: 'https://chiangmaifamilyadvocates.com',
    address: 'Chang Khlan Road, Chiang Mai',
    googleMapsUrl: 'https://maps.google.com/?q=Chiang+Mai+Family+Advocates',
    shortDescription: 'Compassionate family and probate counsel.',
    featured: false,
    foundingYear: 2017,
    companySize: '1-5',
    languages: ['English', 'Thai'],
    feeRangeMin: 2500,
    feeRangeMax: 12000,
    feeCurrency: 'THB',
    practiceAreas: ['Family Law', 'Wills & Estate Planning', 'Contract Law'],
    locations: ['Chiang Mai'],
    primaryLocation: 'Chiang Mai',
    officeLocations: [
      {
        location: 'Chiang Mai',
        address: 'Chang Khlan Road, Chiang Mai',
        phone: '+66 53 555 1601',
        email: 'chiangmai@chiangmaifamilyadvocates.com',
        googleMapsUrl: 'https://maps.google.com/?q=Chiang+Mai+Family+Advocates',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Sirinapa Boon',
        role: 'Founding Partner',
        bio: 'Family mediator and estate planner.',
        email: 'sirinapa@chiangmaifamilyadvocates.com',
      },
      {
        name: 'David Clark',
        role: 'Associate',
        bio: 'Supports probate and family law cases.',
        email: 'david@chiangmaifamilyadvocates.com',
      },
    ],
    services: [
      { service: 'Divorce mediation' },
      { service: 'Estate planning' },
      { service: 'Guardianship support' },
    ],
  },
  {
    name: 'Bangkok Tax & Finance Advisors',
    email: 'contact@bkktaxfinance.com',
    phone: '+66 2 555 1701',
    website: 'https://bkktaxfinance.com',
    address: 'Lumphini, Bangkok',
    googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Tax+Finance+Advisors',
    shortDescription: 'Tax planning and finance counsel for enterprises.',
    featured: false,
    foundingYear: 2004,
    companySize: '26-50',
    languages: ['English', 'Thai'],
    feeRangeMin: 7000,
    feeRangeMax: 45000,
    feeCurrency: 'THB',
    practiceAreas: ['Tax Law', 'Banking & Finance', 'Corporate Law'],
    locations: ['Bangkok'],
    primaryLocation: 'Bangkok',
    officeLocations: [
      {
        location: 'Bangkok',
        address: 'Lumphini, Bangkok',
        phone: '+66 2 555 1701',
        email: 'bangkok@bkktaxfinance.com',
        googleMapsUrl: 'https://maps.google.com/?q=Bangkok+Tax+Finance+Advisors',
        openingHours: extendedHours,
      },
    ],
    teamMembers: [
      {
        name: 'Sompong Ritt',
        role: 'Senior Partner',
        bio: 'Leads tax advisory and compliance.',
        email: 'sompong@bkktaxfinance.com',
      },
      {
        name: 'Nina Patel',
        role: 'Partner',
        bio: 'Specialist in finance structuring.',
        email: 'nina@bkktaxfinance.com',
      },
    ],
    services: [
      { service: 'Tax planning' },
      { service: 'Finance structuring' },
      { service: 'Regulatory compliance' },
    ],
  },
  {
    name: 'Southern Maritime Counsel',
    email: 'info@southernmaritimecounsel.com',
    phone: '+66 76 555 1801',
    website: 'https://southernmaritimecounsel.com',
    address: 'Phuket Old Town, Phuket',
    googleMapsUrl: 'https://maps.google.com/?q=Southern+Maritime+Counsel',
    shortDescription: 'Maritime and insurance disputes counsel.',
    featured: false,
    foundingYear: 2006,
    companySize: '11-25',
    languages: ['English', 'Thai'],
    feeRangeMin: 5000,
    feeRangeMax: 30000,
    feeCurrency: 'THB',
    practiceAreas: ['Maritime Law', 'Insurance Law', 'Arbitration & Mediation'],
    locations: ['Phuket', 'Krabi'],
    primaryLocation: 'Phuket',
    officeLocations: [
      {
        location: 'Phuket',
        address: 'Phuket Old Town, Phuket',
        phone: '+66 76 555 1801',
        email: 'phuket@southernmaritimecounsel.com',
        googleMapsUrl: 'https://maps.google.com/?q=Southern+Maritime+Counsel',
        openingHours: weekdayHours,
      },
      {
        location: 'Krabi',
        address: 'Ao Nang, Krabi',
        phone: '+66 75 555 1802',
        email: 'krabi@southernmaritimecounsel.com',
        googleMapsUrl: 'https://maps.google.com/?q=Southern+Maritime+Counsel+Krabi',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Piyawat Jir',
        role: 'Managing Partner',
        bio: 'Handles maritime disputes and arbitration.',
        email: 'piyawat@southernmaritimecounsel.com',
      },
      {
        name: 'Hanna Weber',
        role: 'Senior Associate',
        bio: 'Insurance claims and dispute advisory.',
        email: 'hanna@southernmaritimecounsel.com',
      },
    ],
    services: [
      { service: 'Marine insurance claims' },
      { service: 'Arbitration representation' },
      { service: 'Shipping compliance audits' },
    ],
  },
  {
    name: 'Northeast Construction Law',
    email: 'contact@neconstructionlaw.com',
    phone: '+66 43 555 1901',
    website: 'https://neconstructionlaw.com',
    address: 'Khon Kaen Business District',
    googleMapsUrl: 'https://maps.google.com/?q=Northeast+Construction+Law',
    shortDescription: 'Construction and project dispute specialists.',
    featured: false,
    foundingYear: 2019,
    companySize: '1-5',
    languages: ['English', 'Thai'],
    feeRangeMin: 3000,
    feeRangeMax: 16000,
    feeCurrency: 'THB',
    practiceAreas: ['Construction Law', 'Contract Law', 'Corporate Law'],
    locations: ['Khon Kaen'],
    primaryLocation: 'Khon Kaen',
    officeLocations: [
      {
        location: 'Khon Kaen',
        address: 'Khon Kaen Business District',
        phone: '+66 43 555 1901',
        email: 'khonkaen@neconstructionlaw.com',
        googleMapsUrl: 'https://maps.google.com/?q=Northeast+Construction+Law',
        openingHours: weekdayHours,
      },
    ],
    teamMembers: [
      {
        name: 'Arisa Pong',
        role: 'Founding Partner',
        bio: 'Construction contracts and dispute resolution.',
        email: 'arisa@neconstructionlaw.com',
      },
      {
        name: 'Luke Harper',
        role: 'Associate',
        bio: 'Project compliance and claims support.',
        email: 'luke@neconstructionlaw.com',
      },
    ],
    services: [
      { service: 'Construction contract drafting' },
      { service: 'Project dispute advisory' },
      { service: 'Compliance monitoring' },
    ],
  },
]
