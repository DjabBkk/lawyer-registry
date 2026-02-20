export type PracticeAreaSeed = {
  name: string
  shortDescription: string
  icon: string
  featuredOrder?: number
  tier: 'tier-1' | 'tier-2' | 'tier-3'
  seoTitle?: string
  seoDescription?: string
}

export const practiceAreas: PracticeAreaSeed[] = [
  {
    name: 'Family Law',
    shortDescription:
      'Guidance for divorce, custody, child support, adoption, and family rights matters in Thailand.',
    icon: 'users',
    featuredOrder: 1,
    tier: 'tier-1',
    seoTitle: 'Family Law Lawyers in Thailand | Find a Family Law Attorney',
    seoDescription:
      'Find trusted family law lawyers in Thailand for divorce, custody, support, and adoption matters with clear, practical legal guidance.',
  },
  {
    name: 'Immigration Law',
    shortDescription:
      'Support for visas, work permits, residency, citizenship, and immigration compliance across Thailand.',
    icon: 'passport',
    featuredOrder: 2,
    tier: 'tier-1',
    seoTitle: 'Immigration Law Lawyers in Thailand | Find a Immigration Law Attorney',
    seoDescription:
      'Compare immigration law lawyers in Thailand for visa applications, work permits, residency pathways, and compliance support.',
  },
  {
    name: 'Real Estate Law',
    shortDescription:
      'Legal help with purchases, leases, title checks, ownership structures, and property disputes.',
    icon: 'building',
    featuredOrder: 3,
    tier: 'tier-1',
    seoTitle: 'Real Estate Law Lawyers in Thailand | Find a Real Estate Law Attorney',
    seoDescription:
      'Find real estate law lawyers in Thailand for property purchases, lease contracts, due diligence, and ownership structuring advice.',
  },
  {
    name: 'Corporate & Business Law',
    shortDescription:
      'Company setup, governance, compliance, contracts, and strategic legal support for business growth.',
    icon: 'briefcase',
    featuredOrder: 4,
    tier: 'tier-1',
    seoTitle: 'Corporate & Business Law Lawyers in Thailand | Find a Corporate & Business Law Attorney',
    seoDescription:
      'Connect with corporate and business law lawyers in Thailand for incorporation, compliance, contracts, and strategic transactions.',
  },
  {
    name: 'Criminal Law',
    shortDescription:
      'Defense representation for investigations, charges, bail, trial proceedings, and criminal appeals.',
    icon: 'shield',
    featuredOrder: 5,
    tier: 'tier-1',
    seoTitle: 'Criminal Law Lawyers in Thailand | Find a Criminal Law Attorney',
    seoDescription:
      'Find experienced criminal law lawyers in Thailand for police representation, defense strategy, bail applications, and court advocacy.',
  },
  {
    name: 'Employment & Labor Law',
    shortDescription:
      'Advice on employment contracts, termination, compensation, discrimination, and labor court matters.',
    icon: 'badge-check',
    featuredOrder: 6,
    tier: 'tier-1',
    seoTitle: 'Employment & Labor Law Lawyers in Thailand | Find a Employment & Labor Law Attorney',
    seoDescription:
      'Compare employment and labor law lawyers in Thailand for workplace disputes, contracts, severance claims, and employer compliance.',
  },
  {
    name: 'Estate Planning & Probate',
    shortDescription:
      'Planning for wills, probate, inheritance, trusts, and long-term asset protection arrangements.',
    icon: 'file-heart',
    featuredOrder: 7,
    tier: 'tier-1',
    seoTitle: 'Estate Planning & Probate Lawyers in Thailand | Find a Estate Planning & Probate Attorney',
    seoDescription:
      'Find estate planning and probate lawyers in Thailand for wills, inheritance administration, trust structures, and succession planning.',
  },
  {
    name: 'Civil Litigation & Dispute Resolution',
    shortDescription:
      'Representation for civil claims, contract disputes, debt recovery, and courtroom litigation strategy.',
    icon: 'scale',
    tier: 'tier-2',
    seoTitle:
      'Civil Litigation & Dispute Resolution Lawyers in Thailand | Find a Civil Litigation & Dispute Resolution Attorney',
    seoDescription:
      'Find civil litigation and dispute resolution lawyers in Thailand for contract disputes, debt collection, claims management, and trial support.',
  },
  {
    name: 'Bankruptcy & Insolvency',
    shortDescription:
      'Support for restructuring, rehabilitation, liquidation, creditor rights, and insolvency proceedings.',
    icon: 'landmark',
    tier: 'tier-2',
    seoTitle: 'Bankruptcy & Insolvency Lawyers in Thailand | Find a Bankruptcy & Insolvency Attorney',
    seoDescription:
      'Find bankruptcy and insolvency lawyers in Thailand for debt restructuring, business rehabilitation, liquidation, and creditor representation.',
  },
  {
    name: 'Personal Injury Law',
    shortDescription:
      'Assistance with accident claims, injury compensation, liability disputes, and damages recovery.',
    icon: 'heart-pulse',
    tier: 'tier-2',
    seoTitle: 'Personal Injury Law Lawyers in Thailand | Find a Personal Injury Law Attorney',
    seoDescription:
      'Compare personal injury law lawyers in Thailand for accident claims, liability disputes, compensation assessment, and settlement strategy.',
  },
  {
    name: 'Medical Malpractice',
    shortDescription:
      'Legal recourse for negligence by healthcare providers, hospitals, and medical professionals.',
    icon: 'stethoscope',
    tier: 'tier-2',
    seoTitle: 'Medical Malpractice Lawyers in Thailand | Find a Medical Malpractice Attorney',
    seoDescription:
      'Find medical malpractice lawyers in Thailand for misdiagnosis, surgical errors, hospital negligence, and compensation claims support.',
  },
  {
    name: 'Intellectual Property Law',
    shortDescription:
      'Protection and enforcement of trademarks, patents, copyrights, trade secrets, and IP licenses.',
    icon: 'lightbulb',
    tier: 'tier-2',
    seoTitle: 'Intellectual Property Law Lawyers in Thailand | Find a Intellectual Property Law Attorney',
    seoDescription:
      'Find intellectual property law lawyers in Thailand for trademark filing, patent strategy, IP licensing, and infringement enforcement.',
  },
  {
    name: 'Tax Law',
    shortDescription:
      'Advisory for personal and corporate tax planning, VAT compliance, and tax disputes.',
    icon: 'calculator',
    tier: 'tier-2',
    seoTitle: 'Tax Law Lawyers in Thailand | Find a Tax Law Attorney',
    seoDescription:
      'Compare tax law lawyers in Thailand for personal tax issues, corporate planning, VAT compliance, and tax dispute resolution.',
  },
  {
    name: 'Cybersecurity & Data Privacy',
    shortDescription:
      'PDPA compliance, breach response, policy drafting, and data governance legal support.',
    icon: 'shield-check',
    tier: 'tier-2',
    seoTitle:
      'Cybersecurity & Data Privacy Lawyers in Thailand | Find a Cybersecurity & Data Privacy Attorney',
    seoDescription:
      'Find cybersecurity and data privacy lawyers in Thailand for PDPA audits, breach response, and cross-border data transfer compliance.',
  },
  {
    name: 'Notarial & Document Services',
    shortDescription:
      'Document notarization, legalization, affidavits, and certified paperwork for local and international use.',
    icon: 'file-badge',
    tier: 'tier-2',
    seoTitle:
      'Notarial & Document Services Lawyers in Thailand | Find a Notarial & Document Services Attorney',
    seoDescription:
      'Find notarial and document services lawyers in Thailand for apostille, legalization, affidavits, and certified document preparation.',
  },
  {
    name: 'Banking & Finance Law',
    shortDescription:
      'Counsel for lending, security, compliance, debt restructuring, and fintech-related transactions.',
    icon: 'landmark',
    tier: 'tier-3',
    seoTitle: 'Banking & Finance Law Lawyers in Thailand | Find a Banking & Finance Law Attorney',
    seoDescription:
      'Find banking and finance law lawyers in Thailand for loan agreements, regulatory compliance, restructuring, and fintech matters.',
  },
  {
    name: 'Maritime Law',
    shortDescription:
      'Legal support for shipping contracts, cargo claims, vessel disputes, and maritime operations.',
    icon: 'anchor',
    tier: 'tier-3',
    seoTitle: 'Maritime Law Lawyers in Thailand | Find a Maritime Law Attorney',
    seoDescription:
      'Find maritime law lawyers in Thailand for shipping contracts, cargo claims, vessel disputes, and seafarer rights matters.',
  },
  {
    name: 'Construction Law',
    shortDescription:
      'Advisory on construction contracts, defects, project delays, zoning compliance, and disputes.',
    icon: 'hammer',
    tier: 'tier-3',
    seoTitle: 'Construction Law Lawyers in Thailand | Find a Construction Law Attorney',
    seoDescription:
      'Compare construction law lawyers in Thailand for contract drafting, defect claims, project delays, and contractor dispute resolution.',
  },
  {
    name: 'Insurance Law',
    shortDescription:
      'Representation for policy interpretation, claims disputes, and insurance liability matters.',
    icon: 'shield',
    tier: 'tier-3',
    seoTitle: 'Insurance Law Lawyers in Thailand | Find a Insurance Law Attorney',
    seoDescription:
      'Find insurance law lawyers in Thailand for policy reviews, claims disputes, life insurance conflicts, and business interruption cases.',
  },
  {
    name: 'Arbitration & Mediation',
    shortDescription:
      'Alternative dispute resolution for commercial conflicts, mediation, and arbitral enforcement.',
    icon: 'handshake',
    tier: 'tier-3',
    seoTitle: 'Arbitration & Mediation Lawyers in Thailand | Find a Arbitration & Mediation Attorney',
    seoDescription:
      'Find arbitration and mediation lawyers in Thailand for commercial disputes, negotiated settlements, and arbitral award enforcement.',
  },
  {
    name: 'International Trade Law',
    shortDescription:
      'Cross-border trade counsel for customs, agreements, anti-dumping, and sanctions compliance.',
    icon: 'globe',
    tier: 'tier-3',
    seoTitle:
      'International Trade Law Lawyers in Thailand | Find a International Trade Law Attorney',
    seoDescription:
      'Compare international trade law lawyers in Thailand for import-export compliance, customs disputes, and sanctions risk management.',
  },
  {
    name: 'Environmental Law',
    shortDescription:
      'Counsel for environmental compliance, permitting, liability exposure, and environmental disputes.',
    icon: 'leaf',
    tier: 'tier-3',
    seoTitle: 'Environmental Law Lawyers in Thailand | Find a Environmental Law Attorney',
    seoDescription:
      'Find environmental law lawyers in Thailand for EIA compliance, pollution liability, permits, and industrial environmental disputes.',
  },
  {
    name: 'Entertainment & Media Law',
    shortDescription:
      'Legal support for media contracts, talent deals, licensing, and reputation protection.',
    icon: 'clapperboard',
    tier: 'tier-3',
    seoTitle:
      'Entertainment & Media Law Lawyers in Thailand | Find a Entertainment & Media Law Attorney',
    seoDescription:
      'Compare entertainment and media law lawyers in Thailand for publishing, talent agreements, licensing, and defamation management.',
  },
  {
    name: 'Aviation Law',
    shortDescription:
      'Advice on aviation regulation, leasing, financing, passenger claims, and sector compliance.',
    icon: 'plane',
    tier: 'tier-3',
    seoTitle: 'Aviation Law Lawyers in Thailand | Find a Aviation Law Attorney',
    seoDescription:
      'Find aviation law lawyers in Thailand for airline compliance, aircraft finance, leasing arrangements, and aviation insurance matters.',
  },
]
