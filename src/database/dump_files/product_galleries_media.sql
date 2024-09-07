-- -------------------------------------------------------------
-- TablePlus 6.1.2(568)
--
-- https://tableplus.com/
--
-- Database: maepui_core_test
-- Generation Time: 2567-08-31 15:29:46.4310
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."product_galleries_media";
-- This script only contains the table creation statements and does not fully represent the table in the database. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."product_galleries_media" (
    "productId" uuid NOT NULL,
    "mediaId" uuid NOT NULL,
    CONSTRAINT "FK_daa16fa569e08808aa8311936b4" FOREIGN KEY ("mediaId") REFERENCES "public"."media"("id"),
    CONSTRAINT "FK_e0aeeb1a38431e39777a9eb8a7f" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("productId","mediaId")
);

-- Indices
CREATE UNIQUE INDEX "PK_97101e7b4b449ca8b3c4710bf87" ON public.product_galleries_media USING btree ("productId", "mediaId");
CREATE INDEX "IDX_e0aeeb1a38431e39777a9eb8a7" ON public.product_galleries_media USING btree ("productId");
CREATE INDEX "IDX_daa16fa569e08808aa8311936b" ON public.product_galleries_media USING btree ("mediaId");

INSERT INTO "public"."product_galleries_media" ("productId", "mediaId") VALUES
('1693c4c6-3513-4763-9d0e-f303e2307de4', '2f78068b-8ae3-4cb3-84f3-3629b3d9e43e'),
('29204165-051e-45a6-ae3b-08ee5a0955a6', '2e874854-e8a1-440c-88c9-81a856c5e182'),
('4487e3a0-4e47-4361-bf5b-4e36032620f0', 'd6edf3cc-b83e-465c-931b-ec7e06e449f0'),
('4914172b-1a37-4219-b057-9835d50adb3e', 'c73bcbb6-9707-4575-a5fb-9f5ef8f4e957'),
('639776c2-c486-4d2a-ba9c-cdb23da29a11', 'e9a29c89-0859-467a-ae86-d4f4864ebfe9'),
('91db07a9-8f94-4cc0-a952-6d46c379374c', 'a62e367e-71cc-4a73-96e4-9e09a52d958c'),
('9550659a-c69d-47ae-9226-e7ed756bbc01', '7cd3b9bd-299f-4339-aad4-f3b1f5d40683'),
('a41d9346-8a7e-4cbe-9685-f9619deb4810', 'ba3af054-3ff2-4280-a2e2-ec18c2c7ce1d'),
('a8d90e99-c9de-40d7-a889-cf2b8b747f0e', 'e234d1e6-8a48-44a0-a856-b66547b44fb4'),
('ce119ae5-67e0-40ba-afec-34e0dfd45bd0', 'a66a8d74-6641-4c00-88db-12601996afb9'),
('d9a5fff5-7690-4634-badc-3e5c839a53ef', 'fcae73db-98c9-4f8b-a35c-2661b9290a1a'),
('fc2c2269-02d4-4561-bd3b-1f30dfcde7a7', 'a66a8d74-6641-4c00-88db-12601996afb9'),
('fc36590c-fdce-47bb-be7d-51b47ced4d3e', '45f94dfd-4b1d-4257-b3e4-7215f205685f');
