-- -------------------------------------------------------------
-- TablePlus 4.1.0(376)
--
-- https://tableplus.com/
--
-- Database: maepui_core
-- Generation Time: 2567-02-21 21:51:27.7110
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."thai_geographies";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."thai_geographies" (
    "id" text,
    "name" text
);

INSERT INTO "public"."thai_geographies" ("id", "name") VALUES
('1', 'ภาคเหนือ'),
('2', 'ภาคกลาง'),
('3', 'ภาคตะวันออกเฉียงเหนือ'),
('4', 'ภาคตะวันตก'),
('5', 'ภาคตะวันออก'),
('6', 'ภาคใต้');
