import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE "public"."enum_businesses_business_type" AS ENUM(
        'law-firm',
        'lawyer',
        'accounting-firm',
        'accountant'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum__businesses_v_version_business_type" AS ENUM(
        'law-firm',
        'lawyer',
        'accounting-firm',
        'accountant'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum_businesses_service_categories" AS ENUM(
        'legal',
        'accounting',
        'visa-services',
        'company-registration',
        'tax',
        'audit'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum__businesses_v_version_service_categories" AS ENUM(
        'legal',
        'accounting',
        'visa-services',
        'company-registration',
        'tax',
        'audit'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    ALTER TABLE "businesses"
      ADD COLUMN IF NOT EXISTS "business_type" "enum_businesses_business_type" DEFAULT 'law-firm';

    ALTER TABLE "_businesses_v"
      ADD COLUMN IF NOT EXISTS "version_business_type" "enum__businesses_v_version_business_type" DEFAULT 'law-firm';

    CREATE TABLE IF NOT EXISTS "businesses_service_categories" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_businesses_service_categories",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_businesses_v_version_service_categories" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum__businesses_v_version_service_categories",
      "id" serial PRIMARY KEY NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "businesses_service_categories_order_idx" ON "businesses_service_categories" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "businesses_service_categories_parent_id_idx" ON "businesses_service_categories" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_businesses_v_version_service_categories_order_idx" ON "_businesses_v_version_service_categories" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_businesses_v_version_service_categories_parent_id_idx" ON "_businesses_v_version_service_categories" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "businesses_business_type_idx" ON "businesses" USING btree ("business_type");
    CREATE INDEX IF NOT EXISTS "_businesses_v_version_version_business_type_idx" ON "_businesses_v" USING btree ("version_business_type");

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'profile_type'
      ) THEN
        EXECUTE '
          UPDATE "businesses"
          SET "business_type" = CASE
            WHEN "profile_type"::text = ''solo'' THEN ''lawyer''::"enum_businesses_business_type"
            ELSE ''law-firm''::"enum_businesses_business_type"
          END
          WHERE "business_type" IS NULL
        ';
      ELSE
        EXECUTE '
          UPDATE "businesses"
          SET "business_type" = ''law-firm''::"enum_businesses_business_type"
          WHERE "business_type" IS NULL
        ';
      END IF;
    END
    $$;

    ALTER TABLE "businesses" ALTER COLUMN "business_type" SET NOT NULL;

    INSERT INTO "businesses_service_categories" ("order", "parent_id", "value")
    SELECT 1, b.id, 'legal'::"enum_businesses_service_categories"
    FROM "businesses" b
    WHERE NOT EXISTS (
      SELECT 1
      FROM "businesses_service_categories" s
      WHERE s."parent_id" = b.id
    );

    ALTER TABLE "businesses" DROP COLUMN IF EXISTS "profile_type";
    ALTER TABLE "_businesses_v" DROP COLUMN IF EXISTS "version_profile_type";

    DROP TYPE IF EXISTS "public"."enum_law_firms_profile_type";
    DROP TYPE IF EXISTS "public"."enum__law_firms_v_version_profile_type";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE "public"."enum_law_firms_profile_type" AS ENUM('firm', 'solo');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum__law_firms_v_version_profile_type" AS ENUM('firm', 'solo');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    ALTER TABLE "businesses"
      ADD COLUMN IF NOT EXISTS "profile_type" "enum_law_firms_profile_type" DEFAULT 'firm';

    ALTER TABLE "_businesses_v"
      ADD COLUMN IF NOT EXISTS "version_profile_type" "enum__law_firms_v_version_profile_type" DEFAULT 'firm';

    UPDATE "businesses"
    SET "profile_type" = CASE
      WHEN "business_type"::text IN ('lawyer', 'accountant') THEN 'solo'::"enum_law_firms_profile_type"
      ELSE 'firm'::"enum_law_firms_profile_type"
    END;

    DROP INDEX IF EXISTS "businesses_service_categories_order_idx";
    DROP INDEX IF EXISTS "businesses_service_categories_parent_id_idx";
    DROP INDEX IF EXISTS "_businesses_v_version_service_categories_order_idx";
    DROP INDEX IF EXISTS "_businesses_v_version_service_categories_parent_id_idx";
    DROP INDEX IF EXISTS "businesses_business_type_idx";
    DROP INDEX IF EXISTS "_businesses_v_version_version_business_type_idx";

    DROP TABLE IF EXISTS "businesses_service_categories";
    DROP TABLE IF EXISTS "_businesses_v_version_service_categories";

    ALTER TABLE "businesses" DROP COLUMN IF EXISTS "business_type";
    ALTER TABLE "_businesses_v" DROP COLUMN IF EXISTS "version_business_type";

    DROP TYPE IF EXISTS "public"."enum_businesses_business_type";
    DROP TYPE IF EXISTS "public"."enum__businesses_v_version_business_type";
    DROP TYPE IF EXISTS "public"."enum_businesses_service_categories";
    DROP TYPE IF EXISTS "public"."enum__businesses_v_version_service_categories";
  `)
}
