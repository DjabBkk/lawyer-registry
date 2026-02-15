# Thailand Law Firm Directory - Technical Plan

## Project Overview

Build a comprehensive, SEO-optimized law firm directory for Thailand that ranks for high-value keywords like "lawyer Thailand," "attorney Thailand," practice area combinations (e.g., "criminal lawyer Thailand"), and location-based searches (e.g., "real estate lawyer Bangkok").

---

## User Types

### Backend Users (Admin Team)

Backend users are team members who manage content through the Payload CMS admin panel.

- **Authentication**: Handled by Payload's built-in authentication system
- **Roles**: Admin, Editor
- **Access**: Full CRUD operations on all collections via `/admin`
- **MVP Scope**: Yes - required for content management

### Frontend Users (Website Visitors)

Frontend users are visitors who find the website through Google search.

- **Authentication**: Will use Supabase Auth (future)
- **Features**: Shortlisting law firms, sending inquiries to multiple firms
- **MVP Scope**: No - backlog feature

**For MVP, all website visitors are anonymous users with read-only access to published content.**

---

## MVP vs Backlog Features

### MVP Features (Go-Live Requirements)

1. ✅ Law firm listings with comprehensive profiles
2. ✅ Practice area (category) pages for SEO
3. ✅ Location pages for SEO
4. ✅ Combined category + location pages for long-tail SEO
5. ✅ Homepage with featured firms, categories, locations
6. ✅ Search functionality (basic)
7. ✅ Filter sidebar on listing pages
8. ✅ SEO optimization (meta tags, structured data)
9. ✅ Sitemaps for Google indexing
10. ✅ Responsive design
11. ✅ Seed database with sample data
12. ✅ Admin panel for content management

### Backlog Features (Post-Launch)

1. ❌ Frontend user authentication (Supabase Auth)
2. ❌ Shortlist/bookmark law firms
3. ❌ Contact/inquiry system (send messages to firms)
4. ❌ Multi-firm messaging from shortlist
5. ❌ Lead capture and management
6. ❌ Monetization (listing tiers, subscriptions)
7. ❌ Reviews and ratings
8. ❌ Multi-language support (Thai, Chinese)
9. ❌ Advanced search with autocomplete
10. ❌ Analytics dashboard

---

## Phase 1: Database Schema & Collections

### 1.1 Law Firms Collection

The core collection storing all law firm profiles.

**Fields:**

- **Basic Information**
  - `name` (text, required) - Law firm name
  - `slug` (text, unique, auto-generated from name) - URL-friendly identifier
  - `logo` (upload, relationship to Media) - Firm logo
  - `coverImage` (upload, relationship to Media) - Hero/banner image
  - `description` (rich text) - Full firm description for profile page
  - `shortDescription` (textarea, max 200 chars) - Used in cards/listings
  - `featured` (checkbox) - Whether to show on homepage featured section
  - `featuredOrder` (number) - Display order for featured firms

- **Contact Information**
  - `email` (email, required)
  - `phone` (text)
  - `website` (text, URL)
  - `address` (textarea)
  - `googleMapsUrl` (text) - Embedded map link

- **Firm Details**
  - `foundingYear` (number, 4 digits)
  - `companySize` (select: "1-5", "6-10", "11-25", "26-50", "51-100", "100+")
  - `languages` (array of select: "English", "Thai", "Chinese", "Japanese", "German", "French", etc.)
  - `feeRangeMin` (number) - Minimum consultation fee in THB
  - `feeRangeMax` (number) - Maximum consultation fee in THB
  - `feeCurrency` (select: "THB", "USD", "EUR") - Default THB

- **Relationships**
  - `practiceAreas` (relationship to PracticeAreas, hasMany) - Links to practice area categories
  - `locations` (relationship to Locations, hasMany) - Links to location entries
  - `primaryLocation` (relationship to Locations, hasOne) - Main office location

- **Team Members (array/blocks)**
  - `teamMembers` (array)
    - `name` (text, required)
    - `role` (select: "Founding Partner", "Managing Partner", "Senior Partner", "Partner", "Senior Associate", "Associate", "Of Counsel", "Legal Consultant")
    - `photo` (upload, relationship to Media)
    - `bio` (textarea)
    - `email` (email)
    - `linkedIn` (text, URL)

- **Services Offered (array)**
  - `services` (array of text) - List of specific services

- **SEO Fields** (use Payload SEO plugin)
  - `meta.title`
  - `meta.description`
  - `meta.image`

- **Status**
  - `_status` (draft/published) - Use Payload's built-in draft system

**Access Control:**
- Read: Anyone (for published firms)
- Create/Update/Delete: Authenticated backend admins only

---

### 1.2 Practice Areas Collection

Stores practice areas/legal specializations for SEO category pages.

**Fields:**

- `name` (text, required) - Display name (e.g., "Criminal Law")
- `slug` (text, unique, auto-generated) - URL slug (e.g., "criminal-law")
- `description` (rich text) - Detailed description for category page
- `shortDescription` (textarea) - Brief description for listings
- `icon` (text) - Icon name for UI display (e.g., "scale", "briefcase")
- `featured` (checkbox) - Show on homepage
- `featuredOrder` (number) - Display order

**SEO Fields:**
- `seoTitle` (text) - Custom SEO title
- `seoDescription` (textarea) - Meta description for the category page

**Access Control:**
- Read: Anyone
- Create/Update/Delete: Authenticated backend admins only

---

### 1.3 Locations Collection

Stores cities/regions for location-based SEO pages.

**Fields:**

- `name` (text, required) - Location name (e.g., "Bangkok")
- `slug` (text, unique, auto-generated)
- `region` (select: "Central", "North", "Northeast", "East", "South") - For grouping
- `description` (rich text) - Location page description
- `shortDescription` (textarea)
- `featured` (checkbox)
- `featuredOrder` (number)

**SEO Fields:**
- `seoTitle` (text)
- `seoDescription` (textarea)

**Access Control:**
- Read: Anyone
- Create/Update/Delete: Authenticated backend admins only

---

### 1.4 Media Collection

Use Payload's built-in Media collection for images.

**Fields:**
- Standard Payload media fields
- `alt` (text) - Alt text for accessibility/SEO

---

### 1.5 Users Collection (Backend Admins Only)

Payload's built-in Users collection for backend authentication.

**Fields:**
- `email` (email, required)
- `password` (encrypted)
- `role` (select: "admin", "editor")

**Note:** This is for backend team members only. Frontend user authentication is a backlog feature using Supabase Auth.

---

## Phase 2: Seed Database

### 2.1 Overview

Create a comprehensive seed database that can be:
- Seeded with one click from the Payload admin dashboard
- Deleted/cleared with one click
- Re-seeded when needed

**Note: Keep all default Payload collections (Posts, Pages, Categories, etc.). The new collections (LawFirms, PracticeAreas, Locations) are additional collections that will be grouped together in the admin sidebar under "Law Firm Registry".**

### 2.2 Seed Data Contents

#### Practice Areas (25 categories)

1. Criminal Law
2. Family Law
3. Immigration Law
4. Real Estate Law
5. Corporate Law
6. Mergers & Acquisitions
7. Tax Law
8. Intellectual Property
9. Employment Law
10. Banking & Finance
11. Insurance Law
12. Personal Injury
13. Medical Malpractice
14. Construction Law
15. Environmental Law
16. International Trade
17. Maritime Law
18. Aviation Law
19. Entertainment Law
20. Sports Law
21. Bankruptcy & Insolvency
22. Arbitration & Mediation
23. Cybersecurity & Data Privacy
24. Wills & Estate Planning
25. Contract Law

#### Locations (10 cities)

1. Bangkok (Central)
2. Pattaya (East)
3. Phuket (South)
4. Chiang Mai (North)
5. Hua Hin (Central)
6. Koh Samui (South)
7. Krabi (South)
8. Chiang Rai (North)
9. Udon Thani (Northeast)
10. Khon Kaen (Northeast)

#### Law Firms (20 firms)

Generate 20 realistic law firm profiles with:
- Varied names (mix of Thai and international-sounding firms)
- Random selection of 2-5 practice areas per firm
- Assigned to 1-2 locations
- Realistic contact information (placeholder emails/phones)
- Team members (2-5 per firm)
- Varied company sizes
- Fee ranges (2,000-50,000 THB)
- Languages (always English + Thai, some with additional)
- Services offered
- Short and long descriptions
- Some marked as featured

### 2.3 Seed Admin UI

Add to the Payload admin dashboard (BeforeDashboard component):

**Seed Database Panel:**
- "Seed Database" button - Populates all collections with sample data
- "Clear Database" button - Removes all seeded data (with confirmation)
- "Re-seed Database" button - Clears and re-seeds in one action
- Status indicator showing if database is seeded or empty
- Count display: "X Law Firms, Y Practice Areas, Z Locations"

**Implementation:**
- Create seed endpoint at `/api/seed`
- Create clear endpoint at `/api/seed/clear`
- Add buttons to BeforeDashboard component
- Show loading states during operations

---

## Phase 3: Page Structure & Routes

### 3.1 Homepage (`/`)

**Sections:**
1. **Hero Section**
   - Headline: "Find Your Lawyer in Thailand"
   - Search bar with practice area dropdown and location dropdown
   - CTA button

2. **Featured Law Firms**
   - Grid of 6-8 featured law firm cards
   - "View All" link to `/law-firms`

3. **Browse by Practice Area**
   - Grid of category cards (icons + names)
   - Featured categories only
   - Links to `/[category-slug]`

4. **Browse by Location**
   - Grid/list of featured locations
   - "Find lawyers in Bangkok", "Find lawyers in Pattaya", etc.
   - Links to `/locations/[location-slug]`

5. **Trust Signals**
   - Number of law firms listed
   - Number of practice areas covered
   - Number of locations

6. **Footer**
   - Navigation links
   - Practice area links
   - Location links

---

### 3.2 Practice Area Pages (`/[category-slug]`)

**Example URLs:**
- `/criminal-law` → Criminal lawyers in Thailand
- `/family-law` → Family lawyers in Thailand
- `/immigration-law` → Immigration lawyers in Thailand

**Page Structure:**
1. **Hero Section**
   - Practice area name as H1
   - Description
   - Breadcrumb: Home > [Practice Area]

2. **Filter Sidebar (Left)**
   - Location filter (dropdown or checkboxes)
   - Company size filter
   - Language filter

3. **Results Grid (Right)**
   - Law firm cards (horizontal layout)
   - Pagination

4. **SEO Content Block**
   - Rich text about the practice area in Thailand

---

### 3.3 Location Pages (`/locations/[location-slug]`)

**Example URLs:**
- `/locations/bangkok` → Law firms in Bangkok
- `/locations/pattaya` → Law firms in Pattaya
- `/locations/phuket` → Law firms in Phuket

**Page Structure:**
- Same as practice area pages but filtered by location
- H1: "Law Firms in [Location]"
- Filter by practice area instead of location

---

### 3.4 Combined Practice Area + Location Pages (`/[category-slug]/[location-slug]`)

**Example URLs:**
- `/criminal-law/bangkok` → Criminal lawyers in Bangkok
- `/real-estate-law/pattaya` → Real estate lawyers in Pattaya
- `/immigration-law/phuket` → Immigration lawyers in Phuket

**Critical for SEO targeting long-tail keywords.**

**Page Structure:**
- H1: "[Practice Area] Lawyers in [Location]"
- Same filter/results layout
- SEO content specific to the combination

---

### 3.5 Law Firm Profile Pages (`/law-firms/[slug]`)

**Example URLs:**
- `/law-firms/bangkok-legal-partners`
- `/law-firms/siam-attorneys`

**Page Structure:**

1. **Hero Section**
   - Cover image
   - Logo
   - Firm name (H1)
   - Short description
   - Quick stats: Location, Founded, Size, Languages
   - Contact buttons: Call, Email, Visit Website

2. **About Section**
   - Full description (rich text)

3. **Practice Areas**
   - List/grid of practice area badges
   - Links to category pages

4. **Services Offered**
   - Bullet list of services

5. **Team Section**
   - Grid of team member cards
   - Photo, name, role, bio

6. **Contact Information**
   - Address with map embed (if googleMapsUrl provided)
   - Phone, email, website links

7. **Related Firms**
   - Other firms in same location or practice area

---

### 3.6 Law Firms Index Page (`/law-firms`)

**All law firms listing with filters**

- Full filter sidebar
- Sorting options (A-Z, Featured)
- Pagination

---

### 3.7 Search Results Page (`/search`)

**Dynamic search results**

- Query parameter: `?q=search+term`
- Basic full-text search across firm names, descriptions
- Filter options

---

## Phase 4: Reusable Components

### 4.1 Law Firm Card Component

**Used in:** Practice area pages, location pages, search results, homepage, related firms

**Layout:** Horizontal card (1/3 image, 2/3 content)

**Content:**
- Left: Firm logo/image
- Right:
  - Firm name (linked)
  - Location badge
  - Practice area badges (max 3-4, with "+X more")
  - Short description (truncated)
  - "View Profile" button

**Props:**
- `firm` - Law firm data object
- `variant` - "default" | "compact" | "featured"

---

### 4.2 Filter Sidebar Component

**Used in:** All listing pages

**Filters:**
- Practice Area (multi-select checkboxes or dropdown)
- Location (multi-select or dropdown)
- Company Size (checkboxes)
- Languages (checkboxes)

**Features:**
- Collapsible sections
- Clear all button
- Active filter count badge
- URL parameter sync

---

### 4.3 Practice Area Badge Component

**Small pill/badge showing practice area name**

**Props:**
- `label` - Display text
- `href` - Link URL
- `icon` - Optional icon

---

### 4.4 Location Badge Component

**Small pill/badge showing location name**

**Props:**
- `label` - Display text
- `href` - Link URL

---

### 4.5 Team Member Card Component

**Used in:** Law firm profile pages

**Content:**
- Photo (circular)
- Name
- Role/title
- Bio (truncated)

---

### 4.6 Search Bar Component

**Used in:** Homepage hero, header (condensed), search page

**Features:**
- Text input
- Practice area dropdown (optional)
- Location dropdown (optional)
- Search button

---

### 4.7 Pagination Component

**Used in:** All listing pages

**Features:**
- Page numbers
- Previous/Next buttons
- "Showing X-Y of Z results"
- URL parameter sync

---

### 4.8 Breadcrumb Component

**Used in:** All inner pages

**Dynamic based on route structure**

---

## Phase 5: SEO Strategy

### 5.1 URL Structure

```
/                                    → Homepage
/law-firms                           → All law firms
/law-firms/[slug]                    → Individual law firm profile
/[category-slug]                     → Practice area page (e.g., /criminal-law)
/[category-slug]/[location-slug]     → Practice area + Location (e.g., /criminal-law/bangkok)
/locations/[location-slug]           → Location page (e.g., /locations/bangkok)
/search                              → Search results
```

### 5.2 Meta Tags Strategy

**Homepage:**
- Title: "Top Law Firms in Thailand | Find Lawyers & Attorneys"
- Description: "Comprehensive directory of law firms in Thailand. Find criminal lawyers, immigration attorneys, real estate lawyers in Bangkok, Pattaya, Phuket and more."

**Practice Area Pages:**
- Title: "[Practice Area] Lawyers in Thailand | Top [Practice Area] Attorneys"
- Description: "Find experienced [practice area] lawyers in Thailand. Compare [practice area] law firms and contact attorneys directly."

**Location Pages:**
- Title: "Law Firms in [Location] | [Location] Lawyers & Attorneys"
- Description: "Find top-rated law firms in [Location], Thailand. Browse lawyers by practice area and contact firms directly."

**Combined Pages:**
- Title: "[Practice Area] Lawyers in [Location] | [Location] [Practice Area] Attorneys"
- Description: "Find the best [practice area] lawyers in [Location], Thailand. Compare experience and contact top [practice area] attorneys."

**Law Firm Profiles:**
- Title: "[Firm Name] | [Primary Practice Area] Lawyers in [Location]"
- Description: "[Short description]. Contact [Firm Name] for [practice areas] legal services in [Location]."

### 5.3 Structured Data (JSON-LD)

**Implement for:**
- Organization (law firms)
- LocalBusiness (with address)
- LegalService (for practice areas)
- BreadcrumbList
- WebPage

### 5.4 Sitemap Strategy

**Generate sitemaps for:**
- Static pages (homepage, search)
- All law firm profiles
- All practice area pages
- All location pages
- All combined practice area + location pages

**Use next-sitemap with custom sitemap generation for dynamic routes**

### 5.5 Internal Linking

- Law firm cards link to profiles
- Practice area badges link to category pages
- Location badges link to location pages
- Related firms section with contextual links
- Breadcrumbs for navigation hierarchy
- Footer with practice area and location links

---

## Phase 6: Performance Optimization

### 6.1 Database Queries

**Follow Payload best practices:**

- Use `select` to limit returned fields
- Use `depth: 0` or `depth: 1` to control relationship population
- Use pagination with reasonable `limit` values (12)
- Cache frequently accessed data (header, footer, featured items)
- Use `where` clauses with indexed fields

**Example query patterns:**

```
// Listing page - minimal fields
{
  collection: 'law-firms',
  where: { _status: { equals: 'published' } },
  select: {
    name: true,
    slug: true,
    shortDescription: true,
    logo: true,
    primaryLocation: true,
    practiceAreas: true,
  },
  depth: 1,
  limit: 12,
  page: currentPage,
}

// Profile page - full data
{
  collection: 'law-firms',
  where: { slug: { equals: slug }, _status: { equals: 'published' } },
  depth: 2,
  limit: 1,
}
```

### 6.2 Static Generation

- Use `generateStaticParams` for all known routes
- Revalidate pages at reasonable intervals (e.g., 3600 seconds)
- Use ISR (Incremental Static Regeneration) for dynamic content

### 6.3 Image Optimization

- Use Next.js Image component
- Configure appropriate image sizes
- Use WebP format
- Implement lazy loading
- Use blur placeholders

### 6.4 Caching Strategy

- Cache global data (header, footer)
- Cache practice area and location lists
- Use React `cache` for request deduplication

---

## Phase 7: Backlog Features (Post-MVP)

### 7.1 Frontend User Authentication (Supabase Auth)

- User registration/login via Supabase Auth
- Social auth (Google, Facebook)
- User profile stored in Supabase
- Session management

### 7.2 Shortlist Feature

- Save/bookmark law firms to shortlist
- View saved firms list
- Remove from shortlist
- Persist across sessions (requires auth)

### 7.3 Contact/Inquiry System

- Send message to single firm
- Send message to multiple firms (from shortlist)
- Email routing through platform
- CC user's email for direct communication
- Track inquiry status in Inquiries collection

### 7.4 Lead Generation & Monetization

- Capture leads through inquiry forms
- Lead analytics dashboard
- Firm subscription tiers (free, basic, premium, featured)
- `listingTier` field on Law Firms collection
- Payment integration (Stripe)

### 7.5 Reviews & Ratings

- User reviews for law firms
- Star ratings
- Moderation system
- Response from firms

### 7.6 Multi-language Support (i18n)

- English (default)
- Thai
- Potential: Chinese

**Preparation for MVP:**
- Use text keys/constants for UI strings where practical
- Plan URL structure: `/th/criminal-law` or subdomain

### 7.7 Advanced Search

- Full-text search with Postgres tsvector
- Autocomplete suggestions
- Search history
- Popular searches

---

## Implementation Order (MVP Sprints)

### Sprint 1: Foundation & Collections
1. Create PracticeAreas collection
2. Create Locations collection
3. Create LawFirms collection
4. Group LawFirms, PracticeAreas, and Locations collections in admin sidebar under "Law Firm Registry" label
5. Keep all default Payload collections (Posts, Pages, Categories, etc.) - do not delete anything
6. Set up Media collection (if not already configured)
7. Configure Users collection for backend admins only

### Sprint 2: Seed Database
1. Create seed data files for practice areas (25)
2. Create seed data files for locations (10)
3. Create seed data files for law firms (20)
4. Build seed endpoint (`/api/seed`)
5. Build clear endpoint (`/api/seed/clear`)
6. Add Seed/Clear buttons to BeforeDashboard component

### Sprint 3: Core Pages
1. Homepage layout and components
2. Law Firm Card component
3. Practice area pages with basic listing
4. Location pages
5. Law firm profile pages

### Sprint 4: Filtering & Search
1. Filter Sidebar component
2. URL parameter sync for filters
3. Pagination component
4. Basic search functionality
5. Combined practice area + location pages

### Sprint 5: SEO & Launch
1. SEO plugin integration
2. Structured data (JSON-LD) implementation
3. Sitemap generation configuration
4. Meta tags optimization
5. Performance audit
6. Testing and QA
7. Launch preparation

---

## Technical Notes

### Payload Plugins

1. **@payloadcms/plugin-seo** - SEO fields for Law Firms collection

### Collections Organization

**Keep all default Payload collections** (Posts, Pages, Categories, etc.) - do not delete or remove any existing collections.

**New Collections:**
- LawFirms
- PracticeAreas
- Locations

**Admin Sidebar Grouping:**
Group the three new collections (LawFirms, PracticeAreas, Locations) together in the Payload admin sidebar under a label called "Law Firm Registry". This can be configured in the Payload config using collection `admin.group` property.

### Key Implementation Details

1. **Slug Generation**: Auto-generate from name using beforeChange hook
2. **Image Handling**: Use Payload Media collection
3. **Draft/Published**: Use Payload's built-in versions/drafts
4. **Access Control**: 
   - Public read for published content
   - Admin-only write operations
   - No frontend user auth in MVP

### Database Considerations (Supabase/Postgres)

- Payload handles schema via migrations
- Ensure indexes on frequently queried fields
- Monitor query performance

---

## Success Metrics (MVP)

1. **SEO Rankings**
   - Track positions for target keywords
   - Monitor organic traffic growth
   - Index coverage in Google Search Console

2. **User Engagement**
   - Page views per session
   - Time on site
   - Bounce rate
   - Profile views per firm

3. **Content Quality**
   - Number of law firms listed
   - Completeness of firm profiles
   - Coverage of practice areas and locations
