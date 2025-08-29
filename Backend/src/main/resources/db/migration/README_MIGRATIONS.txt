Flyway Migration Notes
======================

1. Baseline
-----------
This project uses Flyway to manage schema changes. The initial baseline is represented by the migration:
  V1__initial_core_tables.sql
This file ONLY creates tables if they do not already exist. It is safe against existing environments that already have data.

2. Adding Future Changes
------------------------
For any structural change (adding/dropping/renaming columns, new tables, constraints):
  * Create a new migration file with the next version, e.g. V2__add_index_on_inventory_items.sql
  * Place it in: src/main/resources/db/migration
  * Use only incremental, idempotent SQL (avoid DROP unless intentional and documented).

3. Renaming / Refactoring Tables
--------------------------------
If you later decide to rename inspections_v2 back to inspections:
  * Create migration V2__rename_inspections_v2_to_inspections.sql containing:
      ALTER TABLE inspections_v2 RENAME TO inspections;
      ALTER TABLE inspection_items_v2 RENAME TO inspection_items;
  * Update JPA @Table(name=...) annotations in entity classes in the SAME commit.

4. Data Migrations
------------------
For non-structural data fixes (backfilling columns, updating enum values), still use a versioned migration file.

5. Verification
---------------
At startup you should see in logs something similar to:
  Flyway Community Edition ...
  Successfully validated ...
  Current version of schema ...

6. Troubleshooting
------------------
If Flyway complains about existing schema history missing:
  * You may need to set flyway.baselineOnMigrate=true (already configured) on a fresh environment with existing tables.
  * After baseline, remove baselineOnMigrate or leave as-is; Flyway ignores it once history exists.

7. DO NOT
---------
 * Do not manually edit old migration files after they have been applied.
 * Do not rely on spring.jpa.hibernate.ddl-auto beyond 'validate' (switch from 'update' to 'validate' once stable).

8. Next Recommended Step
------------------------
After confirming persistence works, change application.properties:
  spring.jpa.hibernate.ddl-auto=validate
so that Hibernate stops altering schema and Flyway fully controls evolution.
