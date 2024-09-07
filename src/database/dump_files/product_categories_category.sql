-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: maepui_core_test
-- Generation Time: 2567-08-31 15:29:30.8160
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."product_categories_category";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."product_categories_category" (
    "productId" uuid NOT NULL,
    "categoryId" int4 NOT NULL,
    CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id"),
    CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("productId","categoryId")
);

-- Indices
CREATE UNIQUE INDEX "PK_17f2a361443184000ee8d79f240" ON public.product_categories_category USING btree ("productId", "categoryId");
CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON public.product_categories_category USING btree ("productId");
CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON public.product_categories_category USING btree ("categoryId");

INSERT INTO "public"."product_categories_category" ("productId", "categoryId") VALUES
('1693c4c6-3513-4763-9d0e-f303e2307de4', 1),
('29204165-051e-45a6-ae3b-08ee5a0955a6', 1),
('4487e3a0-4e47-4361-bf5b-4e36032620f0', 1),
('4914172b-1a37-4219-b057-9835d50adb3e', 1),
('639776c2-c486-4d2a-ba9c-cdb23da29a11', 1),
('91db07a9-8f94-4cc0-a952-6d46c379374c', 1),
('9550659a-c69d-47ae-9226-e7ed756bbc01', 1),
('a41d9346-8a7e-4cbe-9685-f9619deb4810', 1),
('a8d90e99-c9de-40d7-a889-cf2b8b747f0e', 1),
('ce119ae5-67e0-40ba-afec-34e0dfd45bd0', 1),
('d9a5fff5-7690-4634-badc-3e5c839a53ef', 1),
('fc2c2269-02d4-4561-bd3b-1f30dfcde7a7', 1),
('fc36590c-fdce-47bb-be7d-51b47ced4d3e', 1);
