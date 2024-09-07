import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustOrderTable1725104492174 implements MigrationInterface {
    name = 'AdjustOrderTable1725104492174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`);
        await queryRunner.query(`DROP INDEX "public"."PK_17f2a361443184000ee8d79f240"`);
        await queryRunner.query(`DROP INDEX "public"."PK_97101e7b4b449ca8b3c4710bf87"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_slip_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "REL_b2f7b823a21562eeca20e72b00"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b2f7b823a21562eeca20e72b006"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "REL_b2f7b823a21562eeca20e72b00" UNIQUE ("order_id")`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_slip_url" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_97101e7b4b449ca8b3c4710bf87" ON "product_galleries_media" ("productId", "mediaId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "PK_17f2a361443184000ee8d79f240" ON "product_categories_category" ("productId", "categoryId") `);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b2f7b823a21562eeca20e72b006" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
