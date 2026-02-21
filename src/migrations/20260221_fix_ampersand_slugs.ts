import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Replace literal `&` characters in slug columns with `and`.
 *
 * Affected tables (any collection whose slug is generated via toKebabCase):
 *   practice_areas, services, locations, countries, categories, businesses
 *
 * Example: `corporate-&-business-law` → `corporate-and-business-law`
 */

const SLUG_TABLES = [
  'practice_areas',
  'services',
  'locations',
  'countries',
  'categories',
  'businesses',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of SLUG_TABLES) {
    await db.execute(sql`
      UPDATE ${sql.identifier(table)}
      SET slug = REPLACE(slug, '&', 'and')
      WHERE slug LIKE '%&%'
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of SLUG_TABLES) {
    await db.execute(sql`
      UPDATE ${sql.identifier(table)}
      SET slug = REPLACE(slug, '-and-', '-&-')
      WHERE slug LIKE '%-and-%'
    `)
  }
}
