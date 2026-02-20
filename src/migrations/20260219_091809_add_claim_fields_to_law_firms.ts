import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
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

    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_law_firms_listing_tier') THEN
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'claimed'
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'bronze'
        ) THEN
          ALTER TYPE "public"."enum_law_firms_listing_tier" RENAME VALUE 'claimed' TO 'bronze';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'premium'
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'gold'
        ) THEN
          ALTER TYPE "public"."enum_law_firms_listing_tier" RENAME VALUE 'premium' TO 'gold';
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'silver'
        ) THEN
          ALTER TYPE "public"."enum_law_firms_listing_tier" ADD VALUE 'silver';
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'platinum'
        ) THEN
          ALTER TYPE "public"."enum_law_firms_listing_tier" ADD VALUE 'platinum';
        END IF;
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__law_firms_v_version_listing_tier') THEN
        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'claimed'
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'bronze'
        ) THEN
          ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" RENAME VALUE 'claimed' TO 'bronze';
        END IF;

        IF EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'premium'
        ) AND NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'gold'
        ) THEN
          ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" RENAME VALUE 'premium' TO 'gold';
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'silver'
        ) THEN
          ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" ADD VALUE 'silver';
        END IF;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'platinum'
        ) THEN
          ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" ADD VALUE 'platinum';
        END IF;
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF to_regclass('public.law_firms') IS NOT NULL THEN
        ALTER TABLE "law_firms"
          ADD COLUMN IF NOT EXISTS "claim_token" varchar,
          ADD COLUMN IF NOT EXISTS "claim_token_used_at" timestamp(3) with time zone,
          ADD COLUMN IF NOT EXISTS "supabase_user_id" varchar,
          ADD COLUMN IF NOT EXISTS "profile_type" "enum_law_firms_profile_type" DEFAULT 'firm';

        CREATE UNIQUE INDEX IF NOT EXISTS "law_firms_claim_token_idx" ON "law_firms" USING btree ("claim_token");
        CREATE INDEX IF NOT EXISTS "law_firms_supabase_user_id_idx" ON "law_firms" USING btree ("supabase_user_id");
      END IF;

      IF to_regclass('public._law_firms_v') IS NOT NULL THEN
        ALTER TABLE "_law_firms_v"
          ADD COLUMN IF NOT EXISTS "version_claim_token" varchar,
          ADD COLUMN IF NOT EXISTS "version_claim_token_used_at" timestamp(3) with time zone,
          ADD COLUMN IF NOT EXISTS "version_supabase_user_id" varchar,
          ADD COLUMN IF NOT EXISTS "version_profile_type" "enum__law_firms_v_version_profile_type" DEFAULT 'firm';

        CREATE INDEX IF NOT EXISTS "_law_firms_v_version_version_claim_token_idx" ON "_law_firms_v" USING btree ("version_claim_token");
        CREATE INDEX IF NOT EXISTS "_law_firms_v_version_version_supabase_user_id_idx" ON "_law_firms_v" USING btree ("version_supabase_user_id");
      END IF;
    END
    $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "law_firms_claim_token_idx";
    DROP INDEX IF EXISTS "law_firms_supabase_user_id_idx";
    DROP INDEX IF EXISTS "_law_firms_v_version_version_claim_token_idx";
    DROP INDEX IF EXISTS "_law_firms_v_version_version_supabase_user_id_idx";

    ALTER TABLE "law_firms"
      DROP COLUMN IF EXISTS "claim_token",
      DROP COLUMN IF EXISTS "claim_token_used_at",
      DROP COLUMN IF EXISTS "supabase_user_id",
      DROP COLUMN IF EXISTS "profile_type";

    ALTER TABLE "_law_firms_v"
      DROP COLUMN IF EXISTS "version_claim_token",
      DROP COLUMN IF EXISTS "version_claim_token_used_at",
      DROP COLUMN IF EXISTS "version_supabase_user_id",
      DROP COLUMN IF EXISTS "version_profile_type";

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'gold'
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'premium'
      ) THEN
        ALTER TYPE "public"."enum_law_firms_listing_tier" RENAME VALUE 'gold' TO 'premium';
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'bronze'
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum_law_firms_listing_tier' AND e.enumlabel = 'claimed'
      ) THEN
        ALTER TYPE "public"."enum_law_firms_listing_tier" RENAME VALUE 'bronze' TO 'claimed';
      END IF;
    END
    $$;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'gold'
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'premium'
      ) THEN
        ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" RENAME VALUE 'gold' TO 'premium';
      END IF;

      IF EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'bronze'
      ) AND NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum__law_firms_v_version_listing_tier' AND e.enumlabel = 'claimed'
      ) THEN
        ALTER TYPE "public"."enum__law_firms_v_version_listing_tier" RENAME VALUE 'bronze' TO 'claimed';
      END IF;
    END
    $$;

    DROP TYPE IF EXISTS "public"."enum_law_firms_profile_type";
    DROP TYPE IF EXISTS "public"."enum__law_firms_v_version_profile_type";
  `)
}
