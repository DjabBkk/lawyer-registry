import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const renamePairs: Array<[from: string, to: string]> = [
  ['law_firms_case_highlights', 'businesses_case_highlights'],
  ['law_firms_faq', 'businesses_faq'],
  ['law_firms_highlights', 'businesses_highlights'],
  ['law_firms_languages', 'businesses_languages'],
  ['law_firms_office_locations', 'businesses_office_locations'],
  ['law_firms_practice_area_details_services', 'businesses_practice_area_details_services'],
  ['law_firms_practice_area_details', 'businesses_practice_area_details'],
  ['law_firms_rels', 'businesses_rels'],
  ['law_firms_service_pricing', 'businesses_service_pricing'],
  ['law_firms_services', 'businesses_services'],
  ['law_firms_team_members', 'businesses_team_members'],
  ['law_firms_testimonials', 'businesses_testimonials'],
  ['_law_firms_v_version_case_highlights', '_businesses_v_version_case_highlights'],
  ['_law_firms_v_version_faq', '_businesses_v_version_faq'],
  ['_law_firms_v_version_highlights', '_businesses_v_version_highlights'],
  ['_law_firms_v_version_languages', '_businesses_v_version_languages'],
  ['_law_firms_v_version_office_locations', '_businesses_v_version_office_locations'],
  [
    '_law_firms_v_version_practice_area_details_services',
    '_businesses_v_version_practice_area_details_services',
  ],
  ['_law_firms_v_version_practice_area_details', '_businesses_v_version_practice_area_details'],
  ['_law_firms_v_version_service_pricing', '_businesses_v_version_service_pricing'],
  ['_law_firms_v_version_services', '_businesses_v_version_services'],
  ['_law_firms_v_version_team_members', '_businesses_v_version_team_members'],
  ['_law_firms_v_version_testimonials', '_businesses_v_version_testimonials'],
  ['_law_firms_v_rels', '_businesses_v_rels'],
  ['_law_firms_v', '_businesses_v'],
  ['law_firms', 'businesses'],
]

const buildRenameSQL = (pairs: Array<[from: string, to: string]>) =>
  pairs
    .map(
      ([from, to]) => `
      DO $$
      BEGIN
        IF to_regclass('public.${from}') IS NOT NULL AND to_regclass('public.${to}') IS NULL THEN
          ALTER TABLE "${from}" RENAME TO "${to}";
        END IF;
      END
      $$;
    `,
    )
    .join('\n')

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(buildRenameSQL(renamePairs)))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  const reversePairs: Array<[from: string, to: string]> = [...renamePairs]
    .reverse()
    .map(([from, to]) => [to, from])

  await db.execute(
    sql.raw(buildRenameSQL(reversePairs)),
  )
}
