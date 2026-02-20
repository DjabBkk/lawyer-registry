import * as migration_20260219_091809_add_claim_fields_to_law_firms from './20260219_091809_add_claim_fields_to_law_firms';
import * as migration_20260219_103000_rename_law_firms_to_businesses from './20260219_103000_rename_law_firms_to_businesses';
import * as migration_20260219_104500_add_business_type_and_service_categories from './20260219_104500_add_business_type_and_service_categories';
import * as migration_20260220_153948_multi_country_foundation from './20260220_153948_multi_country_foundation';

export const migrations = [
  {
    up: migration_20260219_091809_add_claim_fields_to_law_firms.up,
    down: migration_20260219_091809_add_claim_fields_to_law_firms.down,
    name: '20260219_091809_add_claim_fields_to_law_firms',
  },
  {
    up: migration_20260219_103000_rename_law_firms_to_businesses.up,
    down: migration_20260219_103000_rename_law_firms_to_businesses.down,
    name: '20260219_103000_rename_law_firms_to_businesses',
  },
  {
    up: migration_20260219_104500_add_business_type_and_service_categories.up,
    down: migration_20260219_104500_add_business_type_and_service_categories.down,
    name: '20260219_104500_add_business_type_and_service_categories',
  },
  {
    up: migration_20260220_153948_multi_country_foundation.up,
    down: migration_20260220_153948_multi_country_foundation.down,
    name: '20260220_153948_multi_country_foundation'
  },
];
