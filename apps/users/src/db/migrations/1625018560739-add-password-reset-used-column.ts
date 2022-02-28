import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPasswordResetUsedColumn1625018560739 implements MigrationInterface {
  name = 'addPasswordResetUsedColumn1625018560739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "auth"."password_resets"
        ADD "used" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
        ALTER TABLE "auth"."password_resets"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "auth"."password_resets"
        DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
        ALTER TABLE "auth"."password_resets"
        DROP COLUMN "used"
    `);
  }
}
