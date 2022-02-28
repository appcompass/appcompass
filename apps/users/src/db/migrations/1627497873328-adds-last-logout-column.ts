import { MigrationInterface, QueryRunner } from 'typeorm';

export class addsLastLogoutColumn1627497873328 implements MigrationInterface {
  name = 'addsLastLogoutColumn1627497873328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "auth"."users" SET "token_expiration" = now()
    `);

    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      RENAME COLUMN "token_expiration" TO "last_logout"
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout"
      SET NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout"
      SET DEFAULT 'now()'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout" DROP DEFAULT
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout" DROP NOT NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      RENAME COLUMN "last_logout" TO "token_expiration"
    `);
  }
}
