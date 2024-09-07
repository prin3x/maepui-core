-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: maepui_core_test
-- Generation Time: 2567-08-31 15:30:30.0710
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."category";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS category_id_seq;

-- Table Definition
CREATE TABLE "public"."category" (
    "id" int4 NOT NULL DEFAULT nextval('category_id_seq'::regclass),
    "name" varchar NOT NULL,
    "description" varchar,
    "type" varchar NOT NULL DEFAULT 'PRODUCT'::character varying,
    "status" varchar NOT NULL DEFAULT 'ACTIVE'::character varying,
    "thumbnail_id" uuid,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "updated_at" timestamp NOT NULL DEFAULT now(),
    "deleted_at" timestamp,
    CONSTRAINT "FK_289f95936d346c27915df92de18" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id"),
    PRIMARY KEY ("id")
);

-- Indices
CREATE UNIQUE INDEX "PK_9c4e4a89e3674fc9f382d733f03" ON public.category USING btree (id);

INSERT INTO "public"."category" ("id", "name", "description", "type", "status", "thumbnail_id", "created_at", "updated_at", "deleted_at") VALUES
(1, 'Agriculture', NULL, 'PRODUCT', 'ACTIVE', NULL, '2024-03-24 12:09:47.29981', '2024-03-24 12:09:47.29981', NULL);
