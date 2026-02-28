-- AlterTable
ALTER TABLE "Client" ADD COLUMN "slug" TEXT;

-- Backfill slug for existing rows and keep uniqueness on collisions
WITH base AS (
    SELECT
        "id",
        COALESCE(
            NULLIF(
                TRIM(BOTH '-' FROM REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(LOWER("name"), '[^a-z0-9\s-]', '', 'g'),
                        '\s+', '-', 'g'
                    ),
                    '-+', '-', 'g'
                )),
                ''
            ),
            "id"
        ) AS base_slug
    FROM "Client"
),
ranked AS (
    SELECT
        "id",
        base_slug,
        ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY "id") AS rn
    FROM base
)
UPDATE "Client" c
SET "slug" = CASE
    WHEN r.rn = 1 THEN r.base_slug
    ELSE r.base_slug || '-' || r.rn
END
FROM ranked r
WHERE c."id" = r."id";

-- Make slug required and unique
ALTER TABLE "Client" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");
