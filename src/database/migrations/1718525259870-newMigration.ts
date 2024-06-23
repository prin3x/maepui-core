import { MigrationInterface, QueryRunner } from 'typeorm';

export class newMigration1718525259870 implements MigrationInterface {
  name = 'newMigration1718525259870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Running migration: newMigration1718525259870');

    await queryRunner.query(
      `CREATE TABLE "thai_tambons" ("id" SERIAL NOT NULL, "name_th" text, "name_en" text, "amphure_id" text, "zipcode" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_4c6db068ea7fff40c0714b4c0ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "thai_amphures" ("id" SERIAL NOT NULL, "name_th" character varying, "name_en" character varying, "province_id" integer, CONSTRAINT "PK_737cf23cba3b6dbcda92699b180" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."media_type_enum" AS ENUM('PRODUCT', 'CATEGORY', 'BLOG')`);
    await queryRunner.query(
      `CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bucket" character varying NOT NULL, "key" character varying NOT NULL, "type" "public"."media_type_enum" NOT NULL DEFAULT 'PRODUCT', "url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."tag_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "status" "public"."tag_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "blog_id" uuid, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."blog_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "content" character varying NOT NULL, "status" "public"."blog_status_enum" NOT NULL DEFAULT 'ACTIVE', "meta_title" character varying, "meta_description" character varying, "blog_meta_image" character varying, "slug" character varying, "author" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "thumbnail_id" uuid, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "type" character varying NOT NULL DEFAULT 'PRODUCT', "status" character varying NOT NULL DEFAULT 'ACTIVE', "thumbnail_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "status" character varying NOT NULL, "order_id" uuid, CONSTRAINT "REL_b2f7b823a21562eeca20e72b00" UNIQUE ("order_id"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "shipping_address" character varying NOT NULL, "billing_address" character varying NOT NULL, "total_amount" integer NOT NULL, "total_discounts" integer NOT NULL DEFAULT '0', "payment_method" character varying NOT NULL DEFAULT 'money_transfer', "payment_status" character varying NOT NULL DEFAULT 'PENDING', "transaction_id" character varying NOT NULL, "shipping_method" character varying NOT NULL DEFAULT 'standard', "notes" character varying, "tracking_information" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "discount" integer NOT NULL DEFAULT '0', "subtotal" integer NOT NULL, "total" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" SERIAL NOT NULL, "title" character varying, "content" character varying, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."product_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "short_description" character varying NOT NULL, "description" character varying NOT NULL, "price" double precision NOT NULL, "sale_price" double precision NOT NULL, "discount" double precision, "shipping_price" double precision, "stock_quantity" integer, "sku" character varying, "meta_title" character varying, "meta_description" character varying, "meta_keywords" character varying, "status" "public"."product_status_enum" NOT NULL DEFAULT 'ACTIVE', "unit" character varying, "weight" integer, "is_free_shipping" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "thumbnail_id" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subtotal" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "quantity" integer NOT NULL, "cart_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subtotal" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "permissions" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'blocked')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "refresh_token_hash" character varying, "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "phone" character varying, "avatar" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'ไทย', "pincode" character varying, "phone" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "thai_provinces" ("id" SERIAL NOT NULL, "name_th" character varying, "name_en" character varying, "geography_id" integer, CONSTRAINT "PK_76655d0af0fafbc33f0b48ce2d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faq" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_categories_category" ("blogId" uuid NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_5f83120a485466f9e3fe7ada496" PRIMARY KEY ("blogId", "categoryId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_200fdd3b43e7dfde885cf71bd3" ON "blog_categories_category" ("blogId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_f5665dcbec4177775b6edab2b9" ON "blog_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_tags_tag" ("blogId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d" PRIMARY KEY ("blogId", "tagId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9572d27777384d535f77ed780d" ON "blog_tags_tag" ("blogId") `);
    await queryRunner.query(`CREATE INDEX "IDX_066934a149d9efba507443ce88" ON "blog_tags_tag" ("tagId") `);
    await queryRunner.query(
      `CREATE TABLE "product_categories_category" ("productId" uuid NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_17f2a361443184000ee8d79f240" PRIMARY KEY ("productId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_342d06dd0583aafc156e076379" ON "product_categories_category" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15520e638eb4c46c4fb2c61c4b" ON "product_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_galleries_media" ("productId" uuid NOT NULL, "mediaId" uuid NOT NULL, CONSTRAINT "PK_97101e7b4b449ca8b3c4710bf87" PRIMARY KEY ("productId", "mediaId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e0aeeb1a38431e39777a9eb8a7" ON "product_galleries_media" ("productId") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_daa16fa569e08808aa8311936b" ON "product_galleries_media" ("mediaId") `);
    await queryRunner.query(
      `CREATE TABLE "product_tags_tag" ("productId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_8da52c0bc9255c6cb07af25ac73" PRIMARY KEY ("productId", "tagId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_208235f4a5c925f11171252b76" ON "product_tags_tag" ("productId") `);
    await queryRunner.query(`CREATE INDEX "IDX_0de90b04710a86601acdff88c2" ON "product_tags_tag" ("tagId") `);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_9831dcea17f367bca7454c98a56" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "FK_d9b59d44da8be985dbb219a4883" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_289f95936d346c27915df92de18" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_26b533e15b5f2334c96339a1f08" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_5cd3c8b06d45e575517e8358033" FOREIGN KEY ("thumbnail_id") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_a969861629af37cd1c7f4ff3e6b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_200fdd3b43e7dfde885cf71bd3a" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_9572d27777384d535f77ed780d0" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_066934a149d9efba507443ce889" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_342d06dd0583aafc156e0763790" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories_category" ADD CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_galleries_media" ADD CONSTRAINT "FK_e0aeeb1a38431e39777a9eb8a7f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_galleries_media" ADD CONSTRAINT "FK_daa16fa569e08808aa8311936b4" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_tags_tag" ADD CONSTRAINT "FK_208235f4a5c925f11171252b760" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_tags_tag" ADD CONSTRAINT "FK_0de90b04710a86601acdff88c21" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product_tags_tag" DROP CONSTRAINT "FK_0de90b04710a86601acdff88c21"`);
    await queryRunner.query(`ALTER TABLE "product_tags_tag" DROP CONSTRAINT "FK_208235f4a5c925f11171252b760"`);
    await queryRunner.query(`ALTER TABLE "product_galleries_media" DROP CONSTRAINT "FK_daa16fa569e08808aa8311936b4"`);
    await queryRunner.query(`ALTER TABLE "product_galleries_media" DROP CONSTRAINT "FK_e0aeeb1a38431e39777a9eb8a7f"`);
    await queryRunner.query(
      `ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_15520e638eb4c46c4fb2c61c4b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories_category" DROP CONSTRAINT "FK_342d06dd0583aafc156e0763790"`,
    );
    await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_066934a149d9efba507443ce889"`);
    await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_9572d27777384d535f77ed780d0"`);
    await queryRunner.query(`ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b"`);
    await queryRunner.query(`ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_200fdd3b43e7dfde885cf71bd3a"`);
    await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20"`);
    await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_a969861629af37cd1c7f4ff3e6b"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
    await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_b6b2a4f1f533d89d218e70db941"`);
    await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_67a2e8406e01ffa24ff9026944e"`);
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_5cd3c8b06d45e575517e8358033"`);
    await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_26b533e15b5f2334c96339a1f08"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b"`);
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`);
    await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_289f95936d346c27915df92de18"`);
    await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_d9b59d44da8be985dbb219a4883"`);
    await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_9831dcea17f367bca7454c98a56"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0de90b04710a86601acdff88c2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_208235f4a5c925f11171252b76"`);
    await queryRunner.query(`DROP TABLE "product_tags_tag"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_daa16fa569e08808aa8311936b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e0aeeb1a38431e39777a9eb8a7"`);
    await queryRunner.query(`DROP TABLE "product_galleries_media"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_15520e638eb4c46c4fb2c61c4b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_342d06dd0583aafc156e076379"`);
    await queryRunner.query(`DROP TABLE "product_categories_category"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_066934a149d9efba507443ce88"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9572d27777384d535f77ed780d"`);
    await queryRunner.query(`DROP TABLE "blog_tags_tag"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f5665dcbec4177775b6edab2b9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_200fdd3b43e7dfde885cf71bd3"`);
    await queryRunner.query(`DROP TABLE "blog_categories_category"`);
    await queryRunner.query(`DROP TABLE "faq"`);
    await queryRunner.query(`DROP TABLE "thai_provinces"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TYPE "public"."blog_status_enum"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TYPE "public"."tag_status_enum"`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
    await queryRunner.query(`DROP TABLE "thai_amphures"`);
    await queryRunner.query(`DROP TABLE "thai_tambons"`);
  }
}
