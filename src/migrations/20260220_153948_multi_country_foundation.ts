import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'th', 'zh');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'th', 'zh');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'th', 'zh');
  CREATE TYPE "public"."enum_currencies_symbol_position" AS ENUM('before', 'after');
  CREATE TYPE "public"."enum_businesses_team_members_role" AS ENUM('Founding Partner', 'Managing Partner', 'Senior Partner', 'Partner', 'Senior Associate', 'Associate', 'Of Counsel', 'Legal Consultant');
  CREATE TYPE "public"."enum_businesses_service_categories" AS ENUM('legal', 'accounting', 'visa-services', 'company-registration', 'tax', 'audit');
  CREATE TYPE "public"."enum_businesses_response_time" AS ENUM('within-1-hour', 'within-24-hours', 'within-48-hours', 'within-1-week');
  CREATE TYPE "public"."enum_businesses_company_size" AS ENUM('1-5', '6-10', '11-25', '26-50', '51-100', '100+');
  CREATE TYPE "public"."enum_businesses_business_type" AS ENUM('law-firm', 'lawyer', 'accounting-firm', 'accountant');
  CREATE TYPE "public"."enum_businesses_listing_tier" AS ENUM('free', 'bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_businesses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__businesses_v_version_team_members_role" AS ENUM('Founding Partner', 'Managing Partner', 'Senior Partner', 'Partner', 'Senior Associate', 'Associate', 'Of Counsel', 'Legal Consultant');
  CREATE TYPE "public"."enum__businesses_v_version_service_categories" AS ENUM('legal', 'accounting', 'visa-services', 'company-registration', 'tax', 'audit');
  CREATE TYPE "public"."enum__businesses_v_version_response_time" AS ENUM('within-1-hour', 'within-24-hours', 'within-48-hours', 'within-1-week');
  CREATE TYPE "public"."enum__businesses_v_version_company_size" AS ENUM('1-5', '6-10', '11-25', '26-50', '51-100', '100+');
  CREATE TYPE "public"."enum__businesses_v_version_business_type" AS ENUM('law-firm', 'lawyer', 'accounting-firm', 'accountant');
  CREATE TYPE "public"."enum__businesses_v_version_listing_tier" AS ENUM('free', 'bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum__businesses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__businesses_v_published_locale" AS ENUM('en', 'th', 'zh');
  CREATE TYPE "public"."enum_practice_areas_tier" AS ENUM('tier-1', 'tier-2', 'tier-3');
  CREATE TYPE "public"."enum_services_tier" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_locations_location_type" AS ENUM('city', 'district', 'province');
  CREATE TABLE "pages_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT false,
  	"default_currency_id" integer,
  	"default_language_id" integer,
  	"flag_emoji" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries_locales" (
  	"name" varchar NOT NULL,
  	"seo_title_template" varchar,
  	"seo_description_template" varchar,
  	"short_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "currencies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"symbol" varchar NOT NULL,
  	"symbol_position" "enum_currencies_symbol_position" DEFAULT 'before',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "currencies_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "languages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"native_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "languages_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "businesses_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "businesses_highlights_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "businesses_practice_area_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "businesses_practice_area_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"practice_area_id" integer,
  	"description" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_currency_id" integer,
  	"price_note" varchar
  );
  
  CREATE TABLE "businesses_service_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_name" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_note" varchar,
  	"currency_id" integer
  );
  
  CREATE TABLE "businesses_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "businesses_case_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"metric" varchar
  );
  
  CREATE TABLE "businesses_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_title" varchar,
  	"rating" numeric
  );
  
  CREATE TABLE "businesses_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "businesses_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "businesses_office_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location_id" integer,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"opening_hours_monday_closed" boolean DEFAULT false,
  	"opening_hours_monday_open_time" varchar,
  	"opening_hours_monday_close_time" varchar,
  	"opening_hours_tuesday_closed" boolean DEFAULT false,
  	"opening_hours_tuesday_open_time" varchar,
  	"opening_hours_tuesday_close_time" varchar,
  	"opening_hours_wednesday_closed" boolean DEFAULT false,
  	"opening_hours_wednesday_open_time" varchar,
  	"opening_hours_wednesday_close_time" varchar,
  	"opening_hours_thursday_closed" boolean DEFAULT false,
  	"opening_hours_thursday_open_time" varchar,
  	"opening_hours_thursday_close_time" varchar,
  	"opening_hours_friday_closed" boolean DEFAULT false,
  	"opening_hours_friday_open_time" varchar,
  	"opening_hours_friday_close_time" varchar,
  	"opening_hours_saturday_closed" boolean DEFAULT false,
  	"opening_hours_saturday_open_time" varchar,
  	"opening_hours_saturday_close_time" varchar,
  	"opening_hours_sunday_closed" boolean DEFAULT false,
  	"opening_hours_sunday_open_time" varchar,
  	"opening_hours_sunday_close_time" varchar
  );
  
  CREATE TABLE "businesses_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_businesses_team_members_role",
  	"photo_id" integer,
  	"email" varchar,
  	"linked_in" varchar
  );
  
  CREATE TABLE "businesses_team_members_locales" (
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "businesses_service_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_businesses_service_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "businesses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"country_id" integer,
  	"slug" varchar,
  	"logo_id" integer,
  	"cover_image_id" integer,
  	"response_time" "enum_businesses_response_time",
  	"featured" boolean DEFAULT false,
  	"featured_order" numeric,
  	"email" varchar,
  	"phone" varchar,
  	"website" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"founding_year" numeric,
  	"company_size" "enum_businesses_company_size",
  	"fee_range_min" numeric,
  	"fee_range_max" numeric,
  	"fee_currency_id" integer,
  	"hourly_fee_min" numeric,
  	"hourly_fee_max" numeric,
  	"hourly_fee_currency_id" integer,
  	"hourly_fee_note" varchar,
  	"primary_location_id" integer,
  	"business_type" "enum_businesses_business_type" DEFAULT 'law-firm',
  	"claim_token" varchar,
  	"claim_token_used_at" timestamp(3) with time zone,
  	"supabase_user_id" varchar,
  	"listing_tier" "enum_businesses_listing_tier" DEFAULT 'free',
  	"verified" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_businesses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "businesses_locales" (
  	"name" varchar,
  	"description" jsonb,
  	"short_description" varchar,
  	"tagline" varchar,
  	"address" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "businesses_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"languages_id" integer,
  	"services_id" integer,
  	"practice_areas_id" integer,
  	"locations_id" integer
  );
  
  CREATE TABLE "_businesses_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_highlights_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_businesses_v_version_practice_area_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_practice_area_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"practice_area_id" integer,
  	"description" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_currency_id" integer,
  	"price_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_service_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_name" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_note" varchar,
  	"currency_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_case_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"metric" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_title" varchar,
  	"rating" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_businesses_v_version_office_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"location_id" integer,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"opening_hours_monday_closed" boolean DEFAULT false,
  	"opening_hours_monday_open_time" varchar,
  	"opening_hours_monday_close_time" varchar,
  	"opening_hours_tuesday_closed" boolean DEFAULT false,
  	"opening_hours_tuesday_open_time" varchar,
  	"opening_hours_tuesday_close_time" varchar,
  	"opening_hours_wednesday_closed" boolean DEFAULT false,
  	"opening_hours_wednesday_open_time" varchar,
  	"opening_hours_wednesday_close_time" varchar,
  	"opening_hours_thursday_closed" boolean DEFAULT false,
  	"opening_hours_thursday_open_time" varchar,
  	"opening_hours_thursday_close_time" varchar,
  	"opening_hours_friday_closed" boolean DEFAULT false,
  	"opening_hours_friday_open_time" varchar,
  	"opening_hours_friday_close_time" varchar,
  	"opening_hours_saturday_closed" boolean DEFAULT false,
  	"opening_hours_saturday_open_time" varchar,
  	"opening_hours_saturday_close_time" varchar,
  	"opening_hours_sunday_closed" boolean DEFAULT false,
  	"opening_hours_sunday_open_time" varchar,
  	"opening_hours_sunday_close_time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum__businesses_v_version_team_members_role",
  	"photo_id" integer,
  	"email" varchar,
  	"linked_in" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_businesses_v_version_team_members_locales" (
  	"bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_businesses_v_version_service_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__businesses_v_version_service_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_businesses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_country_id" integer,
  	"version_slug" varchar,
  	"version_logo_id" integer,
  	"version_cover_image_id" integer,
  	"version_response_time" "enum__businesses_v_version_response_time",
  	"version_featured" boolean DEFAULT false,
  	"version_featured_order" numeric,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_website" varchar,
  	"version_google_maps_url" varchar,
  	"version_nearest_transit" varchar,
  	"version_founding_year" numeric,
  	"version_company_size" "enum__businesses_v_version_company_size",
  	"version_fee_range_min" numeric,
  	"version_fee_range_max" numeric,
  	"version_fee_currency_id" integer,
  	"version_hourly_fee_min" numeric,
  	"version_hourly_fee_max" numeric,
  	"version_hourly_fee_currency_id" integer,
  	"version_hourly_fee_note" varchar,
  	"version_primary_location_id" integer,
  	"version_business_type" "enum__businesses_v_version_business_type" DEFAULT 'law-firm',
  	"version_claim_token" varchar,
  	"version_claim_token_used_at" timestamp(3) with time zone,
  	"version_supabase_user_id" varchar,
  	"version_listing_tier" "enum__businesses_v_version_listing_tier" DEFAULT 'free',
  	"version_verified" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__businesses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__businesses_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_businesses_v_locales" (
  	"version_name" varchar,
  	"version_description" jsonb,
  	"version_short_description" varchar,
  	"version_tagline" varchar,
  	"version_address" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_businesses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"languages_id" integer,
  	"services_id" integer,
  	"practice_areas_id" integer,
  	"locations_id" integer
  );
  
  CREATE TABLE "practice_areas_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"short_description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"practice_area_id" integer NOT NULL,
  	"tier" "enum_services_tier" DEFAULT 'primary',
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"name" varchar NOT NULL,
  	"short_description" varchar,
  	"seo_title_template" varchar,
  	"seo_description_template" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "locations_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"short_description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_country_id" integer,
  	"support_email" varchar,
  	"social_links_facebook" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"social_links_instagram" varchar,
  	"social_links_youtube" varchar,
  	"seo_defaults_og_image_id" integer,
  	"analytics_ids_google_tag_manager" varchar,
  	"analytics_ids_google_analytics" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar NOT NULL,
  	"seo_defaults_meta_title" varchar,
  	"seo_defaults_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "law_firms_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_practice_area_details_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_practice_area_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_service_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_case_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_office_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "law_firms_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_practice_area_details_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_practice_area_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_service_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_case_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_office_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_version_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_law_firms_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "law_firms_highlights" CASCADE;
  DROP TABLE "law_firms_languages" CASCADE;
  DROP TABLE "law_firms_practice_area_details_services" CASCADE;
  DROP TABLE "law_firms_practice_area_details" CASCADE;
  DROP TABLE "law_firms_service_pricing" CASCADE;
  DROP TABLE "law_firms_services" CASCADE;
  DROP TABLE "law_firms_case_highlights" CASCADE;
  DROP TABLE "law_firms_testimonials" CASCADE;
  DROP TABLE "law_firms_faq" CASCADE;
  DROP TABLE "law_firms_office_locations" CASCADE;
  DROP TABLE "law_firms_team_members" CASCADE;
  DROP TABLE "law_firms" CASCADE;
  DROP TABLE "law_firms_rels" CASCADE;
  DROP TABLE "_law_firms_v_version_highlights" CASCADE;
  DROP TABLE "_law_firms_v_version_languages" CASCADE;
  DROP TABLE "_law_firms_v_version_practice_area_details_services" CASCADE;
  DROP TABLE "_law_firms_v_version_practice_area_details" CASCADE;
  DROP TABLE "_law_firms_v_version_service_pricing" CASCADE;
  DROP TABLE "_law_firms_v_version_services" CASCADE;
  DROP TABLE "_law_firms_v_version_case_highlights" CASCADE;
  DROP TABLE "_law_firms_v_version_testimonials" CASCADE;
  DROP TABLE "_law_firms_v_version_faq" CASCADE;
  DROP TABLE "_law_firms_v_version_office_locations" CASCADE;
  DROP TABLE "_law_firms_v_version_team_members" CASCADE;
  DROP TABLE "_law_firms_v" CASCADE;
  DROP TABLE "_law_firms_v_rels" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_law_firms_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_law_firms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_law_firms_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_law_firms_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_law_firms_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "posts_meta_meta_image_idx";
  DROP INDEX "_posts_v_version_meta_version_meta_image_idx";
  DROP INDEX "redirects_rels_law_firms_id_idx";
  DROP INDEX "search_rels_law_firms_id_idx";
  DROP INDEX "payload_locked_documents_rels_law_firms_id_idx";
  DROP INDEX "header_rels_law_firms_id_idx";
  DROP INDEX "footer_rels_law_firms_id_idx";
  ALTER TABLE "locations" ALTER COLUMN "region" SET DATA TYPE varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "published_locale" "enum__pages_v_published_locale";
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "categories_breadcrumbs" ADD COLUMN "_locale" "_locales" NOT NULL;
  ALTER TABLE "practice_areas" ADD COLUMN "tier" "enum_practice_areas_tier" DEFAULT 'tier-2';
  ALTER TABLE "locations" ADD COLUMN "country_id" integer NOT NULL;
  ALTER TABLE "locations" ADD COLUMN "location_type" "enum_locations_location_type" NOT NULL;
  ALTER TABLE "locations" ADD COLUMN "parent_id" integer;
  ALTER TABLE "locations" ADD COLUMN "zip_codes" varchar;
  ALTER TABLE "redirects_rels" ADD COLUMN "businesses_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "businesses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "countries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "currencies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "languages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "businesses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "businesses_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "businesses_id" integer;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_default_currency_id_currencies_id_fk" FOREIGN KEY ("default_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_default_language_id_languages_id_fk" FOREIGN KEY ("default_language_id") REFERENCES "public"."languages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries_locales" ADD CONSTRAINT "countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "currencies_locales" ADD CONSTRAINT "currencies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."currencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "languages_locales" ADD CONSTRAINT "languages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_highlights" ADD CONSTRAINT "businesses_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_highlights_locales" ADD CONSTRAINT "businesses_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_practice_area_details_services" ADD CONSTRAINT "businesses_practice_area_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses_practice_area_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_practice_area_details" ADD CONSTRAINT "businesses_practice_area_details_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_practice_area_details" ADD CONSTRAINT "businesses_practice_area_details_price_currency_id_currencies_id_fk" FOREIGN KEY ("price_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_practice_area_details" ADD CONSTRAINT "businesses_practice_area_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_service_pricing" ADD CONSTRAINT "businesses_service_pricing_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_service_pricing" ADD CONSTRAINT "businesses_service_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_services" ADD CONSTRAINT "businesses_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_case_highlights" ADD CONSTRAINT "businesses_case_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_testimonials" ADD CONSTRAINT "businesses_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_faq" ADD CONSTRAINT "businesses_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_faq_locales" ADD CONSTRAINT "businesses_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_office_locations" ADD CONSTRAINT "businesses_office_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_office_locations" ADD CONSTRAINT "businesses_office_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_team_members" ADD CONSTRAINT "businesses_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_team_members" ADD CONSTRAINT "businesses_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_team_members_locales" ADD CONSTRAINT "businesses_team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses_team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_service_categories" ADD CONSTRAINT "businesses_service_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_fee_currency_id_currencies_id_fk" FOREIGN KEY ("fee_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_hourly_fee_currency_id_currencies_id_fk" FOREIGN KEY ("hourly_fee_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses" ADD CONSTRAINT "businesses_primary_location_id_locations_id_fk" FOREIGN KEY ("primary_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_locales" ADD CONSTRAINT "businesses_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "businesses_locales" ADD CONSTRAINT "businesses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "businesses_rels" ADD CONSTRAINT "businesses_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_highlights" ADD CONSTRAINT "_businesses_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_highlights_locales" ADD CONSTRAINT "_businesses_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_practice_area_details_services" ADD CONSTRAINT "_businesses_v_version_practice_area_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v_version_practice_area_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_practice_area_details" ADD CONSTRAINT "_businesses_v_version_practice_area_details_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_practice_area_details" ADD CONSTRAINT "_businesses_v_version_practice_area_details_price_currency_id_currencies_id_fk" FOREIGN KEY ("price_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_practice_area_details" ADD CONSTRAINT "_businesses_v_version_practice_area_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_service_pricing" ADD CONSTRAINT "_businesses_v_version_service_pricing_currency_id_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_service_pricing" ADD CONSTRAINT "_businesses_v_version_service_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_services" ADD CONSTRAINT "_businesses_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_case_highlights" ADD CONSTRAINT "_businesses_v_version_case_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_testimonials" ADD CONSTRAINT "_businesses_v_version_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_faq" ADD CONSTRAINT "_businesses_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_faq_locales" ADD CONSTRAINT "_businesses_v_version_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v_version_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_office_locations" ADD CONSTRAINT "_businesses_v_version_office_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_office_locations" ADD CONSTRAINT "_businesses_v_version_office_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_team_members" ADD CONSTRAINT "_businesses_v_version_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_team_members" ADD CONSTRAINT "_businesses_v_version_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_team_members_locales" ADD CONSTRAINT "_businesses_v_version_team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v_version_team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_version_service_categories" ADD CONSTRAINT "_businesses_v_version_service_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_parent_id_businesses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_country_id_countries_id_fk" FOREIGN KEY ("version_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_fee_currency_id_currencies_id_fk" FOREIGN KEY ("version_fee_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_hourly_fee_currency_id_currencies_id_fk" FOREIGN KEY ("version_hourly_fee_currency_id") REFERENCES "public"."currencies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v" ADD CONSTRAINT "_businesses_v_version_primary_location_id_locations_id_fk" FOREIGN KEY ("version_primary_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_locales" ADD CONSTRAINT "_businesses_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_businesses_v_locales" ADD CONSTRAINT "_businesses_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_businesses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_businesses_v_rels" ADD CONSTRAINT "_businesses_v_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practice_areas_locales" ADD CONSTRAINT "practice_areas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations_locales" ADD CONSTRAINT "locations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_country_id_countries_id_fk" FOREIGN KEY ("default_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_defaults_og_image_id_media_id_fk" FOREIGN KEY ("seo_defaults_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE INDEX "countries_default_currency_idx" ON "countries" USING btree ("default_currency_id");
  CREATE INDEX "countries_default_language_idx" ON "countries" USING btree ("default_language_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE UNIQUE INDEX "countries_locales_locale_parent_id_unique" ON "countries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "currencies_code_idx" ON "currencies" USING btree ("code");
  CREATE INDEX "currencies_updated_at_idx" ON "currencies" USING btree ("updated_at");
  CREATE INDEX "currencies_created_at_idx" ON "currencies" USING btree ("created_at");
  CREATE UNIQUE INDEX "currencies_locales_locale_parent_id_unique" ON "currencies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "languages_code_idx" ON "languages" USING btree ("code");
  CREATE INDEX "languages_updated_at_idx" ON "languages" USING btree ("updated_at");
  CREATE INDEX "languages_created_at_idx" ON "languages" USING btree ("created_at");
  CREATE UNIQUE INDEX "languages_locales_locale_parent_id_unique" ON "languages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "businesses_highlights_order_idx" ON "businesses_highlights" USING btree ("_order");
  CREATE INDEX "businesses_highlights_parent_id_idx" ON "businesses_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "businesses_highlights_locales_locale_parent_id_unique" ON "businesses_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "businesses_practice_area_details_services_order_idx" ON "businesses_practice_area_details_services" USING btree ("_order");
  CREATE INDEX "businesses_practice_area_details_services_parent_id_idx" ON "businesses_practice_area_details_services" USING btree ("_parent_id");
  CREATE INDEX "businesses_practice_area_details_order_idx" ON "businesses_practice_area_details" USING btree ("_order");
  CREATE INDEX "businesses_practice_area_details_parent_id_idx" ON "businesses_practice_area_details" USING btree ("_parent_id");
  CREATE INDEX "businesses_practice_area_details_practice_area_idx" ON "businesses_practice_area_details" USING btree ("practice_area_id");
  CREATE INDEX "businesses_practice_area_details_price_currency_idx" ON "businesses_practice_area_details" USING btree ("price_currency_id");
  CREATE INDEX "businesses_service_pricing_order_idx" ON "businesses_service_pricing" USING btree ("_order");
  CREATE INDEX "businesses_service_pricing_parent_id_idx" ON "businesses_service_pricing" USING btree ("_parent_id");
  CREATE INDEX "businesses_service_pricing_currency_idx" ON "businesses_service_pricing" USING btree ("currency_id");
  CREATE INDEX "businesses_services_order_idx" ON "businesses_services" USING btree ("_order");
  CREATE INDEX "businesses_services_parent_id_idx" ON "businesses_services" USING btree ("_parent_id");
  CREATE INDEX "businesses_case_highlights_order_idx" ON "businesses_case_highlights" USING btree ("_order");
  CREATE INDEX "businesses_case_highlights_parent_id_idx" ON "businesses_case_highlights" USING btree ("_parent_id");
  CREATE INDEX "businesses_testimonials_order_idx" ON "businesses_testimonials" USING btree ("_order");
  CREATE INDEX "businesses_testimonials_parent_id_idx" ON "businesses_testimonials" USING btree ("_parent_id");
  CREATE INDEX "businesses_faq_order_idx" ON "businesses_faq" USING btree ("_order");
  CREATE INDEX "businesses_faq_parent_id_idx" ON "businesses_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "businesses_faq_locales_locale_parent_id_unique" ON "businesses_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "businesses_office_locations_order_idx" ON "businesses_office_locations" USING btree ("_order");
  CREATE INDEX "businesses_office_locations_parent_id_idx" ON "businesses_office_locations" USING btree ("_parent_id");
  CREATE INDEX "businesses_office_locations_location_idx" ON "businesses_office_locations" USING btree ("location_id");
  CREATE INDEX "businesses_team_members_order_idx" ON "businesses_team_members" USING btree ("_order");
  CREATE INDEX "businesses_team_members_parent_id_idx" ON "businesses_team_members" USING btree ("_parent_id");
  CREATE INDEX "businesses_team_members_photo_idx" ON "businesses_team_members" USING btree ("photo_id");
  CREATE UNIQUE INDEX "businesses_team_members_locales_locale_parent_id_unique" ON "businesses_team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "businesses_service_categories_order_idx" ON "businesses_service_categories" USING btree ("order");
  CREATE INDEX "businesses_service_categories_parent_idx" ON "businesses_service_categories" USING btree ("parent_id");
  CREATE INDEX "businesses_country_idx" ON "businesses" USING btree ("country_id");
  CREATE UNIQUE INDEX "businesses_slug_idx" ON "businesses" USING btree ("slug");
  CREATE INDEX "businesses_logo_idx" ON "businesses" USING btree ("logo_id");
  CREATE INDEX "businesses_cover_image_idx" ON "businesses" USING btree ("cover_image_id");
  CREATE INDEX "businesses_fee_currency_idx" ON "businesses" USING btree ("fee_currency_id");
  CREATE INDEX "businesses_hourly_fee_currency_idx" ON "businesses" USING btree ("hourly_fee_currency_id");
  CREATE INDEX "businesses_primary_location_idx" ON "businesses" USING btree ("primary_location_id");
  CREATE UNIQUE INDEX "businesses_claim_token_idx" ON "businesses" USING btree ("claim_token");
  CREATE INDEX "businesses_supabase_user_id_idx" ON "businesses" USING btree ("supabase_user_id");
  CREATE INDEX "businesses_updated_at_idx" ON "businesses" USING btree ("updated_at");
  CREATE INDEX "businesses_created_at_idx" ON "businesses" USING btree ("created_at");
  CREATE INDEX "businesses__status_idx" ON "businesses" USING btree ("_status");
  CREATE INDEX "businesses_meta_meta_image_idx" ON "businesses_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "businesses_locales_locale_parent_id_unique" ON "businesses_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "businesses_rels_order_idx" ON "businesses_rels" USING btree ("order");
  CREATE INDEX "businesses_rels_parent_idx" ON "businesses_rels" USING btree ("parent_id");
  CREATE INDEX "businesses_rels_path_idx" ON "businesses_rels" USING btree ("path");
  CREATE INDEX "businesses_rels_media_id_idx" ON "businesses_rels" USING btree ("media_id");
  CREATE INDEX "businesses_rels_languages_id_idx" ON "businesses_rels" USING btree ("languages_id");
  CREATE INDEX "businesses_rels_services_id_idx" ON "businesses_rels" USING btree ("services_id");
  CREATE INDEX "businesses_rels_practice_areas_id_idx" ON "businesses_rels" USING btree ("practice_areas_id");
  CREATE INDEX "businesses_rels_locations_id_idx" ON "businesses_rels" USING btree ("locations_id");
  CREATE INDEX "_businesses_v_version_highlights_order_idx" ON "_businesses_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_highlights_parent_id_idx" ON "_businesses_v_version_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_businesses_v_version_highlights_locales_locale_parent_id_un" ON "_businesses_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_businesses_v_version_practice_area_details_services_order_idx" ON "_businesses_v_version_practice_area_details_services" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_practice_area_details_services_parent_id_idx" ON "_businesses_v_version_practice_area_details_services" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_practice_area_details_order_idx" ON "_businesses_v_version_practice_area_details" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_practice_area_details_parent_id_idx" ON "_businesses_v_version_practice_area_details" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_practice_area_details_practice_are_idx" ON "_businesses_v_version_practice_area_details" USING btree ("practice_area_id");
  CREATE INDEX "_businesses_v_version_practice_area_details_price_curren_idx" ON "_businesses_v_version_practice_area_details" USING btree ("price_currency_id");
  CREATE INDEX "_businesses_v_version_service_pricing_order_idx" ON "_businesses_v_version_service_pricing" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_service_pricing_parent_id_idx" ON "_businesses_v_version_service_pricing" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_service_pricing_currency_idx" ON "_businesses_v_version_service_pricing" USING btree ("currency_id");
  CREATE INDEX "_businesses_v_version_services_order_idx" ON "_businesses_v_version_services" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_services_parent_id_idx" ON "_businesses_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_case_highlights_order_idx" ON "_businesses_v_version_case_highlights" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_case_highlights_parent_id_idx" ON "_businesses_v_version_case_highlights" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_testimonials_order_idx" ON "_businesses_v_version_testimonials" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_testimonials_parent_id_idx" ON "_businesses_v_version_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_faq_order_idx" ON "_businesses_v_version_faq" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_faq_parent_id_idx" ON "_businesses_v_version_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_businesses_v_version_faq_locales_locale_parent_id_unique" ON "_businesses_v_version_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_businesses_v_version_office_locations_order_idx" ON "_businesses_v_version_office_locations" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_office_locations_parent_id_idx" ON "_businesses_v_version_office_locations" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_office_locations_location_idx" ON "_businesses_v_version_office_locations" USING btree ("location_id");
  CREATE INDEX "_businesses_v_version_team_members_order_idx" ON "_businesses_v_version_team_members" USING btree ("_order");
  CREATE INDEX "_businesses_v_version_team_members_parent_id_idx" ON "_businesses_v_version_team_members" USING btree ("_parent_id");
  CREATE INDEX "_businesses_v_version_team_members_photo_idx" ON "_businesses_v_version_team_members" USING btree ("photo_id");
  CREATE UNIQUE INDEX "_businesses_v_version_team_members_locales_locale_parent_id_" ON "_businesses_v_version_team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_businesses_v_version_service_categories_order_idx" ON "_businesses_v_version_service_categories" USING btree ("order");
  CREATE INDEX "_businesses_v_version_service_categories_parent_idx" ON "_businesses_v_version_service_categories" USING btree ("parent_id");
  CREATE INDEX "_businesses_v_parent_idx" ON "_businesses_v" USING btree ("parent_id");
  CREATE INDEX "_businesses_v_version_version_country_idx" ON "_businesses_v" USING btree ("version_country_id");
  CREATE INDEX "_businesses_v_version_version_slug_idx" ON "_businesses_v" USING btree ("version_slug");
  CREATE INDEX "_businesses_v_version_version_logo_idx" ON "_businesses_v" USING btree ("version_logo_id");
  CREATE INDEX "_businesses_v_version_version_cover_image_idx" ON "_businesses_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_businesses_v_version_version_fee_currency_idx" ON "_businesses_v" USING btree ("version_fee_currency_id");
  CREATE INDEX "_businesses_v_version_version_hourly_fee_currency_idx" ON "_businesses_v" USING btree ("version_hourly_fee_currency_id");
  CREATE INDEX "_businesses_v_version_version_primary_location_idx" ON "_businesses_v" USING btree ("version_primary_location_id");
  CREATE INDEX "_businesses_v_version_version_claim_token_idx" ON "_businesses_v" USING btree ("version_claim_token");
  CREATE INDEX "_businesses_v_version_version_supabase_user_id_idx" ON "_businesses_v" USING btree ("version_supabase_user_id");
  CREATE INDEX "_businesses_v_version_version_updated_at_idx" ON "_businesses_v" USING btree ("version_updated_at");
  CREATE INDEX "_businesses_v_version_version_created_at_idx" ON "_businesses_v" USING btree ("version_created_at");
  CREATE INDEX "_businesses_v_version_version__status_idx" ON "_businesses_v" USING btree ("version__status");
  CREATE INDEX "_businesses_v_created_at_idx" ON "_businesses_v" USING btree ("created_at");
  CREATE INDEX "_businesses_v_updated_at_idx" ON "_businesses_v" USING btree ("updated_at");
  CREATE INDEX "_businesses_v_snapshot_idx" ON "_businesses_v" USING btree ("snapshot");
  CREATE INDEX "_businesses_v_published_locale_idx" ON "_businesses_v" USING btree ("published_locale");
  CREATE INDEX "_businesses_v_latest_idx" ON "_businesses_v" USING btree ("latest");
  CREATE INDEX "_businesses_v_autosave_idx" ON "_businesses_v" USING btree ("autosave");
  CREATE INDEX "_businesses_v_version_meta_version_meta_image_idx" ON "_businesses_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_businesses_v_locales_locale_parent_id_unique" ON "_businesses_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_businesses_v_rels_order_idx" ON "_businesses_v_rels" USING btree ("order");
  CREATE INDEX "_businesses_v_rels_parent_idx" ON "_businesses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_businesses_v_rels_path_idx" ON "_businesses_v_rels" USING btree ("path");
  CREATE INDEX "_businesses_v_rels_media_id_idx" ON "_businesses_v_rels" USING btree ("media_id");
  CREATE INDEX "_businesses_v_rels_languages_id_idx" ON "_businesses_v_rels" USING btree ("languages_id");
  CREATE INDEX "_businesses_v_rels_services_id_idx" ON "_businesses_v_rels" USING btree ("services_id");
  CREATE INDEX "_businesses_v_rels_practice_areas_id_idx" ON "_businesses_v_rels" USING btree ("practice_areas_id");
  CREATE INDEX "_businesses_v_rels_locations_id_idx" ON "_businesses_v_rels" USING btree ("locations_id");
  CREATE UNIQUE INDEX "practice_areas_locales_locale_parent_id_unique" ON "practice_areas_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_practice_area_idx" ON "services" USING btree ("practice_area_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "locations_locales_locale_parent_id_unique" ON "locations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_default_country_idx" ON "site_settings" USING btree ("default_country_id");
  CREATE INDEX "site_settings_seo_defaults_seo_defaults_og_image_idx" ON "site_settings" USING btree ("seo_defaults_og_image_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "locations" ADD CONSTRAINT "locations_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_currencies_fk" FOREIGN KEY ("currencies_id") REFERENCES "public"."currencies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_businesses_fk" FOREIGN KEY ("businesses_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "categories_breadcrumbs_locale_idx" ON "categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "locations_country_idx" ON "locations" USING btree ("country_id");
  CREATE INDEX "locations_parent_idx" ON "locations" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_businesses_id_idx" ON "redirects_rels" USING btree ("businesses_id");
  CREATE INDEX "search_rels_businesses_id_idx" ON "search_rels" USING btree ("businesses_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_currencies_id_idx" ON "payload_locked_documents_rels" USING btree ("currencies_id");
  CREATE INDEX "payload_locked_documents_rels_languages_id_idx" ON "payload_locked_documents_rels" USING btree ("languages_id");
  CREATE INDEX "payload_locked_documents_rels_businesses_id_idx" ON "payload_locked_documents_rels" USING btree ("businesses_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "header_rels_businesses_id_idx" ON "header_rels" USING btree ("businesses_id");
  CREATE INDEX "footer_rels_businesses_id_idx" ON "footer_rels" USING btree ("businesses_id");
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "posts" DROP COLUMN "meta_title";
  ALTER TABLE "posts" DROP COLUMN "meta_image_id";
  ALTER TABLE "posts" DROP COLUMN "meta_description";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "practice_areas" DROP COLUMN "name";
  ALTER TABLE "practice_areas" DROP COLUMN "description";
  ALTER TABLE "practice_areas" DROP COLUMN "short_description";
  ALTER TABLE "practice_areas" DROP COLUMN "featured";
  ALTER TABLE "practice_areas" DROP COLUMN "seo_title";
  ALTER TABLE "practice_areas" DROP COLUMN "seo_description";
  ALTER TABLE "locations" DROP COLUMN "name";
  ALTER TABLE "locations" DROP COLUMN "description";
  ALTER TABLE "locations" DROP COLUMN "short_description";
  ALTER TABLE "locations" DROP COLUMN "seo_title";
  ALTER TABLE "locations" DROP COLUMN "seo_description";
  ALTER TABLE "redirects_rels" DROP COLUMN "law_firms_id";
  ALTER TABLE "forms_blocks_checkbox" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_country" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_message" DROP COLUMN "message";
  ALTER TABLE "forms_blocks_number" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select_options" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_select" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_state" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "default_value";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "label";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "default_value";
  ALTER TABLE "forms_emails" DROP COLUMN "subject";
  ALTER TABLE "forms_emails" DROP COLUMN "message";
  ALTER TABLE "forms" DROP COLUMN "submit_button_label";
  ALTER TABLE "forms" DROP COLUMN "confirmation_message";
  ALTER TABLE "search" DROP COLUMN "title";
  ALTER TABLE "search_rels" DROP COLUMN "law_firms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "law_firms_id";
  ALTER TABLE "header_rels" DROP COLUMN "law_firms_id";
  ALTER TABLE "footer_rels" DROP COLUMN "law_firms_id";
  DROP TYPE "public"."enum_law_firms_languages";
  DROP TYPE "public"."enum_law_firms_practice_area_details_price_currency";
  DROP TYPE "public"."enum_law_firms_service_pricing_currency";
  DROP TYPE "public"."enum_law_firms_team_members_role";
  DROP TYPE "public"."enum_law_firms_response_time";
  DROP TYPE "public"."enum_law_firms_company_size";
  DROP TYPE "public"."enum_law_firms_fee_currency";
  DROP TYPE "public"."enum_law_firms_hourly_fee_currency";
  DROP TYPE "public"."enum_law_firms_profile_type";
  DROP TYPE "public"."enum_law_firms_listing_tier";
  DROP TYPE "public"."enum_law_firms_status";
  DROP TYPE "public"."enum__law_firms_v_version_languages";
  DROP TYPE "public"."enum__law_firms_v_version_practice_area_details_price_currency";
  DROP TYPE "public"."enum__law_firms_v_version_service_pricing_currency";
  DROP TYPE "public"."enum__law_firms_v_version_team_members_role";
  DROP TYPE "public"."enum__law_firms_v_version_response_time";
  DROP TYPE "public"."enum__law_firms_v_version_company_size";
  DROP TYPE "public"."enum__law_firms_v_version_fee_currency";
  DROP TYPE "public"."enum__law_firms_v_version_hourly_fee_currency";
  DROP TYPE "public"."enum__law_firms_v_version_profile_type";
  DROP TYPE "public"."enum__law_firms_v_version_listing_tier";
  DROP TYPE "public"."enum__law_firms_v_version_status";
  DROP TYPE "public"."enum_locations_region";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_law_firms_languages" AS ENUM('English', 'Thai', 'Chinese', 'Japanese', 'German', 'French', 'Spanish', 'Russian', 'Arabic');
  CREATE TYPE "public"."enum_law_firms_practice_area_details_price_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum_law_firms_service_pricing_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum_law_firms_team_members_role" AS ENUM('Founding Partner', 'Managing Partner', 'Senior Partner', 'Partner', 'Senior Associate', 'Associate', 'Of Counsel', 'Legal Consultant');
  CREATE TYPE "public"."enum_law_firms_response_time" AS ENUM('within-1-hour', 'within-24-hours', 'within-48-hours', 'within-1-week');
  CREATE TYPE "public"."enum_law_firms_company_size" AS ENUM('1-5', '6-10', '11-25', '26-50', '51-100', '100+');
  CREATE TYPE "public"."enum_law_firms_fee_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum_law_firms_hourly_fee_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum_law_firms_profile_type" AS ENUM('firm', 'solo');
  CREATE TYPE "public"."enum_law_firms_listing_tier" AS ENUM('free', 'bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum_law_firms_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__law_firms_v_version_languages" AS ENUM('English', 'Thai', 'Chinese', 'Japanese', 'German', 'French', 'Spanish', 'Russian', 'Arabic');
  CREATE TYPE "public"."enum__law_firms_v_version_practice_area_details_price_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum__law_firms_v_version_service_pricing_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum__law_firms_v_version_team_members_role" AS ENUM('Founding Partner', 'Managing Partner', 'Senior Partner', 'Partner', 'Senior Associate', 'Associate', 'Of Counsel', 'Legal Consultant');
  CREATE TYPE "public"."enum__law_firms_v_version_response_time" AS ENUM('within-1-hour', 'within-24-hours', 'within-48-hours', 'within-1-week');
  CREATE TYPE "public"."enum__law_firms_v_version_company_size" AS ENUM('1-5', '6-10', '11-25', '26-50', '51-100', '100+');
  CREATE TYPE "public"."enum__law_firms_v_version_fee_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum__law_firms_v_version_hourly_fee_currency" AS ENUM('THB', 'USD', 'EUR');
  CREATE TYPE "public"."enum__law_firms_v_version_profile_type" AS ENUM('firm', 'solo');
  CREATE TYPE "public"."enum__law_firms_v_version_listing_tier" AS ENUM('free', 'bronze', 'silver', 'gold', 'platinum');
  CREATE TYPE "public"."enum__law_firms_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_locations_region" AS ENUM('Central', 'North', 'Northeast', 'East', 'South');
  CREATE TABLE "law_firms_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "law_firms_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_law_firms_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "law_firms_practice_area_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "law_firms_practice_area_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"practice_area_id" integer,
  	"description" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_currency" "enum_law_firms_practice_area_details_price_currency" DEFAULT 'THB',
  	"price_note" varchar
  );
  
  CREATE TABLE "law_firms_service_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service_name" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_note" varchar,
  	"currency" "enum_law_firms_service_pricing_currency" DEFAULT 'THB'
  );
  
  CREATE TABLE "law_firms_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"service" varchar
  );
  
  CREATE TABLE "law_firms_case_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"metric" varchar
  );
  
  CREATE TABLE "law_firms_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_title" varchar,
  	"rating" numeric
  );
  
  CREATE TABLE "law_firms_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "law_firms_office_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"location_id" integer,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"opening_hours_monday_closed" boolean DEFAULT false,
  	"opening_hours_monday_open_time" varchar,
  	"opening_hours_monday_close_time" varchar,
  	"opening_hours_tuesday_closed" boolean DEFAULT false,
  	"opening_hours_tuesday_open_time" varchar,
  	"opening_hours_tuesday_close_time" varchar,
  	"opening_hours_wednesday_closed" boolean DEFAULT false,
  	"opening_hours_wednesday_open_time" varchar,
  	"opening_hours_wednesday_close_time" varchar,
  	"opening_hours_thursday_closed" boolean DEFAULT false,
  	"opening_hours_thursday_open_time" varchar,
  	"opening_hours_thursday_close_time" varchar,
  	"opening_hours_friday_closed" boolean DEFAULT false,
  	"opening_hours_friday_open_time" varchar,
  	"opening_hours_friday_close_time" varchar,
  	"opening_hours_saturday_closed" boolean DEFAULT false,
  	"opening_hours_saturday_open_time" varchar,
  	"opening_hours_saturday_close_time" varchar,
  	"opening_hours_sunday_closed" boolean DEFAULT false,
  	"opening_hours_sunday_open_time" varchar,
  	"opening_hours_sunday_close_time" varchar
  );
  
  CREATE TABLE "law_firms_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_law_firms_team_members_role",
  	"photo_id" integer,
  	"bio" varchar,
  	"email" varchar,
  	"linked_in" varchar
  );
  
  CREATE TABLE "law_firms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"logo_id" integer,
  	"cover_image_id" integer,
  	"description" jsonb,
  	"short_description" varchar,
  	"tagline" varchar,
  	"response_time" "enum_law_firms_response_time",
  	"featured" boolean DEFAULT false,
  	"featured_order" numeric,
  	"email" varchar,
  	"phone" varchar,
  	"website" varchar,
  	"address" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"founding_year" numeric,
  	"company_size" "enum_law_firms_company_size",
  	"fee_range_min" numeric,
  	"fee_range_max" numeric,
  	"fee_currency" "enum_law_firms_fee_currency" DEFAULT 'THB',
  	"hourly_fee_min" numeric,
  	"hourly_fee_max" numeric,
  	"hourly_fee_currency" "enum_law_firms_hourly_fee_currency" DEFAULT 'THB',
  	"hourly_fee_note" varchar,
  	"primary_location_id" integer,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"claim_token" varchar,
  	"claim_token_used_at" timestamp(3) with time zone,
  	"supabase_user_id" varchar,
  	"profile_type" "enum_law_firms_profile_type" DEFAULT 'firm',
  	"listing_tier" "enum_law_firms_listing_tier" DEFAULT 'free',
  	"verified" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_law_firms_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "law_firms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"practice_areas_id" integer,
  	"locations_id" integer
  );
  
  CREATE TABLE "_law_firms_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_languages" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__law_firms_v_version_languages",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_law_firms_v_version_practice_area_details_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_practice_area_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"practice_area_id" integer,
  	"description" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_currency" "enum__law_firms_v_version_practice_area_details_price_currency" DEFAULT 'THB',
  	"price_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_service_pricing" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_name" varchar,
  	"price_min" numeric,
  	"price_max" numeric,
  	"price_note" varchar,
  	"currency" "enum__law_firms_v_version_service_pricing_currency" DEFAULT 'THB',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"service" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_case_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"metric" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author_name" varchar,
  	"author_title" varchar,
  	"rating" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_office_locations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"location_id" integer,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"google_maps_url" varchar,
  	"nearest_transit" varchar,
  	"opening_hours_monday_closed" boolean DEFAULT false,
  	"opening_hours_monday_open_time" varchar,
  	"opening_hours_monday_close_time" varchar,
  	"opening_hours_tuesday_closed" boolean DEFAULT false,
  	"opening_hours_tuesday_open_time" varchar,
  	"opening_hours_tuesday_close_time" varchar,
  	"opening_hours_wednesday_closed" boolean DEFAULT false,
  	"opening_hours_wednesday_open_time" varchar,
  	"opening_hours_wednesday_close_time" varchar,
  	"opening_hours_thursday_closed" boolean DEFAULT false,
  	"opening_hours_thursday_open_time" varchar,
  	"opening_hours_thursday_close_time" varchar,
  	"opening_hours_friday_closed" boolean DEFAULT false,
  	"opening_hours_friday_open_time" varchar,
  	"opening_hours_friday_close_time" varchar,
  	"opening_hours_saturday_closed" boolean DEFAULT false,
  	"opening_hours_saturday_open_time" varchar,
  	"opening_hours_saturday_close_time" varchar,
  	"opening_hours_sunday_closed" boolean DEFAULT false,
  	"opening_hours_sunday_open_time" varchar,
  	"opening_hours_sunday_close_time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v_version_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum__law_firms_v_version_team_members_role",
  	"photo_id" integer,
  	"bio" varchar,
  	"email" varchar,
  	"linked_in" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_law_firms_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_logo_id" integer,
  	"version_cover_image_id" integer,
  	"version_description" jsonb,
  	"version_short_description" varchar,
  	"version_tagline" varchar,
  	"version_response_time" "enum__law_firms_v_version_response_time",
  	"version_featured" boolean DEFAULT false,
  	"version_featured_order" numeric,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_website" varchar,
  	"version_address" varchar,
  	"version_google_maps_url" varchar,
  	"version_nearest_transit" varchar,
  	"version_founding_year" numeric,
  	"version_company_size" "enum__law_firms_v_version_company_size",
  	"version_fee_range_min" numeric,
  	"version_fee_range_max" numeric,
  	"version_fee_currency" "enum__law_firms_v_version_fee_currency" DEFAULT 'THB',
  	"version_hourly_fee_min" numeric,
  	"version_hourly_fee_max" numeric,
  	"version_hourly_fee_currency" "enum__law_firms_v_version_hourly_fee_currency" DEFAULT 'THB',
  	"version_hourly_fee_note" varchar,
  	"version_primary_location_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"version_claim_token" varchar,
  	"version_claim_token_used_at" timestamp(3) with time zone,
  	"version_supabase_user_id" varchar,
  	"version_profile_type" "enum__law_firms_v_version_profile_type" DEFAULT 'firm',
  	"version_listing_tier" "enum__law_firms_v_version_listing_tier" DEFAULT 'free',
  	"version_verified" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__law_firms_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_law_firms_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"practice_areas_id" integer,
  	"locations_id" integer
  );
  
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "currencies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "currencies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "languages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "languages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_practice_area_details_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_practice_area_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_service_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_case_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_office_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_team_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_service_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "businesses_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_practice_area_details_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_practice_area_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_service_pricing" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_case_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_office_locations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_team_members_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_version_service_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_businesses_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "practice_areas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "locations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "countries_locales" CASCADE;
  DROP TABLE "currencies" CASCADE;
  DROP TABLE "currencies_locales" CASCADE;
  DROP TABLE "languages" CASCADE;
  DROP TABLE "languages_locales" CASCADE;
  DROP TABLE "businesses_highlights" CASCADE;
  DROP TABLE "businesses_highlights_locales" CASCADE;
  DROP TABLE "businesses_practice_area_details_services" CASCADE;
  DROP TABLE "businesses_practice_area_details" CASCADE;
  DROP TABLE "businesses_service_pricing" CASCADE;
  DROP TABLE "businesses_services" CASCADE;
  DROP TABLE "businesses_case_highlights" CASCADE;
  DROP TABLE "businesses_testimonials" CASCADE;
  DROP TABLE "businesses_faq" CASCADE;
  DROP TABLE "businesses_faq_locales" CASCADE;
  DROP TABLE "businesses_office_locations" CASCADE;
  DROP TABLE "businesses_team_members" CASCADE;
  DROP TABLE "businesses_team_members_locales" CASCADE;
  DROP TABLE "businesses_service_categories" CASCADE;
  DROP TABLE "businesses" CASCADE;
  DROP TABLE "businesses_locales" CASCADE;
  DROP TABLE "businesses_rels" CASCADE;
  DROP TABLE "_businesses_v_version_highlights" CASCADE;
  DROP TABLE "_businesses_v_version_highlights_locales" CASCADE;
  DROP TABLE "_businesses_v_version_practice_area_details_services" CASCADE;
  DROP TABLE "_businesses_v_version_practice_area_details" CASCADE;
  DROP TABLE "_businesses_v_version_service_pricing" CASCADE;
  DROP TABLE "_businesses_v_version_services" CASCADE;
  DROP TABLE "_businesses_v_version_case_highlights" CASCADE;
  DROP TABLE "_businesses_v_version_testimonials" CASCADE;
  DROP TABLE "_businesses_v_version_faq" CASCADE;
  DROP TABLE "_businesses_v_version_faq_locales" CASCADE;
  DROP TABLE "_businesses_v_version_office_locations" CASCADE;
  DROP TABLE "_businesses_v_version_team_members" CASCADE;
  DROP TABLE "_businesses_v_version_team_members_locales" CASCADE;
  DROP TABLE "_businesses_v_version_service_categories" CASCADE;
  DROP TABLE "_businesses_v" CASCADE;
  DROP TABLE "_businesses_v_locales" CASCADE;
  DROP TABLE "_businesses_v_rels" CASCADE;
  DROP TABLE "practice_areas_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "locations_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  ALTER TABLE "locations" DROP CONSTRAINT "locations_country_id_countries_id_fk";
  
  ALTER TABLE "locations" DROP CONSTRAINT "locations_parent_id_locations_id_fk";
  
  ALTER TABLE "redirects_rels" DROP CONSTRAINT "redirects_rels_businesses_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_businesses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_countries_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_currencies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_languages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_businesses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_businesses_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_businesses_fk";
  
  DROP INDEX "_pages_v_snapshot_idx";
  DROP INDEX "_pages_v_published_locale_idx";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "categories_breadcrumbs_locale_idx";
  DROP INDEX "locations_country_idx";
  DROP INDEX "locations_parent_idx";
  DROP INDEX "redirects_rels_businesses_id_idx";
  DROP INDEX "search_rels_businesses_id_idx";
  DROP INDEX "payload_locked_documents_rels_countries_id_idx";
  DROP INDEX "payload_locked_documents_rels_currencies_id_idx";
  DROP INDEX "payload_locked_documents_rels_languages_id_idx";
  DROP INDEX "payload_locked_documents_rels_businesses_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "header_rels_businesses_id_idx";
  DROP INDEX "footer_rels_businesses_id_idx";
  ALTER TABLE "locations" ALTER COLUMN "region" SET DATA TYPE "public"."enum_locations_region" USING "region"::"public"."enum_locations_region";
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "practice_areas" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "practice_areas" ADD COLUMN "description" jsonb;
  ALTER TABLE "practice_areas" ADD COLUMN "short_description" varchar;
  ALTER TABLE "practice_areas" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "practice_areas" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "practice_areas" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "locations" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "locations" ADD COLUMN "description" jsonb;
  ALTER TABLE "locations" ADD COLUMN "short_description" varchar;
  ALTER TABLE "locations" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "locations" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "redirects_rels" ADD COLUMN "law_firms_id" integer;
  ALTER TABLE "forms_blocks_checkbox" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_country" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_message" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms_blocks_number" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select_options" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_select" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_state" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "label" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "default_value" varchar;
  ALTER TABLE "forms_emails" ADD COLUMN "subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL;
  ALTER TABLE "forms_emails" ADD COLUMN "message" jsonb;
  ALTER TABLE "forms" ADD COLUMN "submit_button_label" varchar;
  ALTER TABLE "forms" ADD COLUMN "confirmation_message" jsonb;
  ALTER TABLE "search" ADD COLUMN "title" varchar;
  ALTER TABLE "search_rels" ADD COLUMN "law_firms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "law_firms_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "law_firms_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "law_firms_id" integer;
  ALTER TABLE "law_firms_highlights" ADD CONSTRAINT "law_firms_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_languages" ADD CONSTRAINT "law_firms_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_practice_area_details_services" ADD CONSTRAINT "law_firms_practice_area_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms_practice_area_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_practice_area_details" ADD CONSTRAINT "law_firms_practice_area_details_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms_practice_area_details" ADD CONSTRAINT "law_firms_practice_area_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_service_pricing" ADD CONSTRAINT "law_firms_service_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_services" ADD CONSTRAINT "law_firms_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_case_highlights" ADD CONSTRAINT "law_firms_case_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_testimonials" ADD CONSTRAINT "law_firms_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_faq" ADD CONSTRAINT "law_firms_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_office_locations" ADD CONSTRAINT "law_firms_office_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms_office_locations" ADD CONSTRAINT "law_firms_office_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_team_members" ADD CONSTRAINT "law_firms_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms_team_members" ADD CONSTRAINT "law_firms_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms" ADD CONSTRAINT "law_firms_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms" ADD CONSTRAINT "law_firms_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms" ADD CONSTRAINT "law_firms_primary_location_id_locations_id_fk" FOREIGN KEY ("primary_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms" ADD CONSTRAINT "law_firms_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "law_firms_rels" ADD CONSTRAINT "law_firms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_rels" ADD CONSTRAINT "law_firms_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_rels" ADD CONSTRAINT "law_firms_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "law_firms_rels" ADD CONSTRAINT "law_firms_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_highlights" ADD CONSTRAINT "_law_firms_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_languages" ADD CONSTRAINT "_law_firms_v_version_languages_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_practice_area_details_services" ADD CONSTRAINT "_law_firms_v_version_practice_area_details_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v_version_practice_area_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_practice_area_details" ADD CONSTRAINT "_law_firms_v_version_practice_area_details_practice_area_id_practice_areas_id_fk" FOREIGN KEY ("practice_area_id") REFERENCES "public"."practice_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_practice_area_details" ADD CONSTRAINT "_law_firms_v_version_practice_area_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_service_pricing" ADD CONSTRAINT "_law_firms_v_version_service_pricing_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_services" ADD CONSTRAINT "_law_firms_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_case_highlights" ADD CONSTRAINT "_law_firms_v_version_case_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_testimonials" ADD CONSTRAINT "_law_firms_v_version_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_faq" ADD CONSTRAINT "_law_firms_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_office_locations" ADD CONSTRAINT "_law_firms_v_version_office_locations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_office_locations" ADD CONSTRAINT "_law_firms_v_version_office_locations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_team_members" ADD CONSTRAINT "_law_firms_v_version_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v_version_team_members" ADD CONSTRAINT "_law_firms_v_version_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v" ADD CONSTRAINT "_law_firms_v_parent_id_law_firms_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."law_firms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v" ADD CONSTRAINT "_law_firms_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v" ADD CONSTRAINT "_law_firms_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v" ADD CONSTRAINT "_law_firms_v_version_primary_location_id_locations_id_fk" FOREIGN KEY ("version_primary_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v" ADD CONSTRAINT "_law_firms_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_law_firms_v_rels" ADD CONSTRAINT "_law_firms_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_law_firms_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_rels" ADD CONSTRAINT "_law_firms_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_rels" ADD CONSTRAINT "_law_firms_v_rels_practice_areas_fk" FOREIGN KEY ("practice_areas_id") REFERENCES "public"."practice_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_law_firms_v_rels" ADD CONSTRAINT "_law_firms_v_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "law_firms_highlights_order_idx" ON "law_firms_highlights" USING btree ("_order");
  CREATE INDEX "law_firms_highlights_parent_id_idx" ON "law_firms_highlights" USING btree ("_parent_id");
  CREATE INDEX "law_firms_languages_order_idx" ON "law_firms_languages" USING btree ("order");
  CREATE INDEX "law_firms_languages_parent_idx" ON "law_firms_languages" USING btree ("parent_id");
  CREATE INDEX "law_firms_practice_area_details_services_order_idx" ON "law_firms_practice_area_details_services" USING btree ("_order");
  CREATE INDEX "law_firms_practice_area_details_services_parent_id_idx" ON "law_firms_practice_area_details_services" USING btree ("_parent_id");
  CREATE INDEX "law_firms_practice_area_details_order_idx" ON "law_firms_practice_area_details" USING btree ("_order");
  CREATE INDEX "law_firms_practice_area_details_parent_id_idx" ON "law_firms_practice_area_details" USING btree ("_parent_id");
  CREATE INDEX "law_firms_practice_area_details_practice_area_idx" ON "law_firms_practice_area_details" USING btree ("practice_area_id");
  CREATE INDEX "law_firms_service_pricing_order_idx" ON "law_firms_service_pricing" USING btree ("_order");
  CREATE INDEX "law_firms_service_pricing_parent_id_idx" ON "law_firms_service_pricing" USING btree ("_parent_id");
  CREATE INDEX "law_firms_services_order_idx" ON "law_firms_services" USING btree ("_order");
  CREATE INDEX "law_firms_services_parent_id_idx" ON "law_firms_services" USING btree ("_parent_id");
  CREATE INDEX "law_firms_case_highlights_order_idx" ON "law_firms_case_highlights" USING btree ("_order");
  CREATE INDEX "law_firms_case_highlights_parent_id_idx" ON "law_firms_case_highlights" USING btree ("_parent_id");
  CREATE INDEX "law_firms_testimonials_order_idx" ON "law_firms_testimonials" USING btree ("_order");
  CREATE INDEX "law_firms_testimonials_parent_id_idx" ON "law_firms_testimonials" USING btree ("_parent_id");
  CREATE INDEX "law_firms_faq_order_idx" ON "law_firms_faq" USING btree ("_order");
  CREATE INDEX "law_firms_faq_parent_id_idx" ON "law_firms_faq" USING btree ("_parent_id");
  CREATE INDEX "law_firms_office_locations_order_idx" ON "law_firms_office_locations" USING btree ("_order");
  CREATE INDEX "law_firms_office_locations_parent_id_idx" ON "law_firms_office_locations" USING btree ("_parent_id");
  CREATE INDEX "law_firms_office_locations_location_idx" ON "law_firms_office_locations" USING btree ("location_id");
  CREATE INDEX "law_firms_team_members_order_idx" ON "law_firms_team_members" USING btree ("_order");
  CREATE INDEX "law_firms_team_members_parent_id_idx" ON "law_firms_team_members" USING btree ("_parent_id");
  CREATE INDEX "law_firms_team_members_photo_idx" ON "law_firms_team_members" USING btree ("photo_id");
  CREATE UNIQUE INDEX "law_firms_slug_idx" ON "law_firms" USING btree ("slug");
  CREATE INDEX "law_firms_logo_idx" ON "law_firms" USING btree ("logo_id");
  CREATE INDEX "law_firms_cover_image_idx" ON "law_firms" USING btree ("cover_image_id");
  CREATE INDEX "law_firms_primary_location_idx" ON "law_firms" USING btree ("primary_location_id");
  CREATE INDEX "law_firms_meta_meta_image_idx" ON "law_firms" USING btree ("meta_image_id");
  CREATE UNIQUE INDEX "law_firms_claim_token_idx" ON "law_firms" USING btree ("claim_token");
  CREATE INDEX "law_firms_supabase_user_id_idx" ON "law_firms" USING btree ("supabase_user_id");
  CREATE INDEX "law_firms_updated_at_idx" ON "law_firms" USING btree ("updated_at");
  CREATE INDEX "law_firms_created_at_idx" ON "law_firms" USING btree ("created_at");
  CREATE INDEX "law_firms__status_idx" ON "law_firms" USING btree ("_status");
  CREATE INDEX "law_firms_rels_order_idx" ON "law_firms_rels" USING btree ("order");
  CREATE INDEX "law_firms_rels_parent_idx" ON "law_firms_rels" USING btree ("parent_id");
  CREATE INDEX "law_firms_rels_path_idx" ON "law_firms_rels" USING btree ("path");
  CREATE INDEX "law_firms_rels_media_id_idx" ON "law_firms_rels" USING btree ("media_id");
  CREATE INDEX "law_firms_rels_practice_areas_id_idx" ON "law_firms_rels" USING btree ("practice_areas_id");
  CREATE INDEX "law_firms_rels_locations_id_idx" ON "law_firms_rels" USING btree ("locations_id");
  CREATE INDEX "_law_firms_v_version_highlights_order_idx" ON "_law_firms_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_highlights_parent_id_idx" ON "_law_firms_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_languages_order_idx" ON "_law_firms_v_version_languages" USING btree ("order");
  CREATE INDEX "_law_firms_v_version_languages_parent_idx" ON "_law_firms_v_version_languages" USING btree ("parent_id");
  CREATE INDEX "_law_firms_v_version_practice_area_details_services_order_idx" ON "_law_firms_v_version_practice_area_details_services" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_practice_area_details_services_parent_id_idx" ON "_law_firms_v_version_practice_area_details_services" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_practice_area_details_order_idx" ON "_law_firms_v_version_practice_area_details" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_practice_area_details_parent_id_idx" ON "_law_firms_v_version_practice_area_details" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_practice_area_details_practice_area_idx" ON "_law_firms_v_version_practice_area_details" USING btree ("practice_area_id");
  CREATE INDEX "_law_firms_v_version_service_pricing_order_idx" ON "_law_firms_v_version_service_pricing" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_service_pricing_parent_id_idx" ON "_law_firms_v_version_service_pricing" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_services_order_idx" ON "_law_firms_v_version_services" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_services_parent_id_idx" ON "_law_firms_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_case_highlights_order_idx" ON "_law_firms_v_version_case_highlights" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_case_highlights_parent_id_idx" ON "_law_firms_v_version_case_highlights" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_testimonials_order_idx" ON "_law_firms_v_version_testimonials" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_testimonials_parent_id_idx" ON "_law_firms_v_version_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_faq_order_idx" ON "_law_firms_v_version_faq" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_faq_parent_id_idx" ON "_law_firms_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_office_locations_order_idx" ON "_law_firms_v_version_office_locations" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_office_locations_parent_id_idx" ON "_law_firms_v_version_office_locations" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_office_locations_location_idx" ON "_law_firms_v_version_office_locations" USING btree ("location_id");
  CREATE INDEX "_law_firms_v_version_team_members_order_idx" ON "_law_firms_v_version_team_members" USING btree ("_order");
  CREATE INDEX "_law_firms_v_version_team_members_parent_id_idx" ON "_law_firms_v_version_team_members" USING btree ("_parent_id");
  CREATE INDEX "_law_firms_v_version_team_members_photo_idx" ON "_law_firms_v_version_team_members" USING btree ("photo_id");
  CREATE INDEX "_law_firms_v_parent_idx" ON "_law_firms_v" USING btree ("parent_id");
  CREATE INDEX "_law_firms_v_version_version_slug_idx" ON "_law_firms_v" USING btree ("version_slug");
  CREATE INDEX "_law_firms_v_version_version_logo_idx" ON "_law_firms_v" USING btree ("version_logo_id");
  CREATE INDEX "_law_firms_v_version_version_cover_image_idx" ON "_law_firms_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_law_firms_v_version_version_primary_location_idx" ON "_law_firms_v" USING btree ("version_primary_location_id");
  CREATE INDEX "_law_firms_v_version_meta_version_meta_image_idx" ON "_law_firms_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_law_firms_v_version_version_claim_token_idx" ON "_law_firms_v" USING btree ("version_claim_token");
  CREATE INDEX "_law_firms_v_version_version_supabase_user_id_idx" ON "_law_firms_v" USING btree ("version_supabase_user_id");
  CREATE INDEX "_law_firms_v_version_version_updated_at_idx" ON "_law_firms_v" USING btree ("version_updated_at");
  CREATE INDEX "_law_firms_v_version_version_created_at_idx" ON "_law_firms_v" USING btree ("version_created_at");
  CREATE INDEX "_law_firms_v_version_version__status_idx" ON "_law_firms_v" USING btree ("version__status");
  CREATE INDEX "_law_firms_v_created_at_idx" ON "_law_firms_v" USING btree ("created_at");
  CREATE INDEX "_law_firms_v_updated_at_idx" ON "_law_firms_v" USING btree ("updated_at");
  CREATE INDEX "_law_firms_v_latest_idx" ON "_law_firms_v" USING btree ("latest");
  CREATE INDEX "_law_firms_v_autosave_idx" ON "_law_firms_v" USING btree ("autosave");
  CREATE INDEX "_law_firms_v_rels_order_idx" ON "_law_firms_v_rels" USING btree ("order");
  CREATE INDEX "_law_firms_v_rels_parent_idx" ON "_law_firms_v_rels" USING btree ("parent_id");
  CREATE INDEX "_law_firms_v_rels_path_idx" ON "_law_firms_v_rels" USING btree ("path");
  CREATE INDEX "_law_firms_v_rels_media_id_idx" ON "_law_firms_v_rels" USING btree ("media_id");
  CREATE INDEX "_law_firms_v_rels_practice_areas_id_idx" ON "_law_firms_v_rels" USING btree ("practice_areas_id");
  CREATE INDEX "_law_firms_v_rels_locations_id_idx" ON "_law_firms_v_rels" USING btree ("locations_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_law_firms_fk" FOREIGN KEY ("law_firms_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_law_firms_fk" FOREIGN KEY ("law_firms_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_law_firms_fk" FOREIGN KEY ("law_firms_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_law_firms_fk" FOREIGN KEY ("law_firms_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_law_firms_fk" FOREIGN KEY ("law_firms_id") REFERENCES "public"."law_firms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "redirects_rels_law_firms_id_idx" ON "redirects_rels" USING btree ("law_firms_id");
  CREATE INDEX "search_rels_law_firms_id_idx" ON "search_rels" USING btree ("law_firms_id");
  CREATE INDEX "payload_locked_documents_rels_law_firms_id_idx" ON "payload_locked_documents_rels" USING btree ("law_firms_id");
  CREATE INDEX "header_rels_law_firms_id_idx" ON "header_rels" USING btree ("law_firms_id");
  CREATE INDEX "footer_rels_law_firms_id_idx" ON "footer_rels" USING btree ("law_firms_id");
  ALTER TABLE "_pages_v" DROP COLUMN "snapshot";
  ALTER TABLE "_pages_v" DROP COLUMN "published_locale";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "categories_breadcrumbs" DROP COLUMN "_locale";
  ALTER TABLE "practice_areas" DROP COLUMN "tier";
  ALTER TABLE "locations" DROP COLUMN "country_id";
  ALTER TABLE "locations" DROP COLUMN "location_type";
  ALTER TABLE "locations" DROP COLUMN "parent_id";
  ALTER TABLE "locations" DROP COLUMN "zip_codes";
  ALTER TABLE "redirects_rels" DROP COLUMN "businesses_id";
  ALTER TABLE "search_rels" DROP COLUMN "businesses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "countries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "currencies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "languages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "businesses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "header_rels" DROP COLUMN "businesses_id";
  ALTER TABLE "footer_rels" DROP COLUMN "businesses_id";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_currencies_symbol_position";
  DROP TYPE "public"."enum_businesses_team_members_role";
  DROP TYPE "public"."enum_businesses_service_categories";
  DROP TYPE "public"."enum_businesses_response_time";
  DROP TYPE "public"."enum_businesses_company_size";
  DROP TYPE "public"."enum_businesses_business_type";
  DROP TYPE "public"."enum_businesses_listing_tier";
  DROP TYPE "public"."enum_businesses_status";
  DROP TYPE "public"."enum__businesses_v_version_team_members_role";
  DROP TYPE "public"."enum__businesses_v_version_service_categories";
  DROP TYPE "public"."enum__businesses_v_version_response_time";
  DROP TYPE "public"."enum__businesses_v_version_company_size";
  DROP TYPE "public"."enum__businesses_v_version_business_type";
  DROP TYPE "public"."enum__businesses_v_version_listing_tier";
  DROP TYPE "public"."enum__businesses_v_version_status";
  DROP TYPE "public"."enum__businesses_v_published_locale";
  DROP TYPE "public"."enum_practice_areas_tier";
  DROP TYPE "public"."enum_services_tier";
  DROP TYPE "public"."enum_locations_location_type";`)
}
