import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustProductSalePrice1725792263987 implements MigrationInterface {
  name = 'AdjustProductSalePrice1725792263987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."PK_17f2a361443184000ee8d79f240"`);
    await queryRunner.query(`DROP INDEX "public"."PK_97101e7b4b449ca8b3c4710bf87"`);
    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "sale_price" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "sale_price" SET NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_97101e7b4b449ca8b3c4710bf87" ON "product_galleries_media" ("productId", "mediaId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "PK_17f2a361443184000ee8d79f240" ON "product_categories_category" ("productId", "categoryId") `,
    );
  }
}
