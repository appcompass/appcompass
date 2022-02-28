import { MigrationInterface, QueryRunner } from 'typeorm';

export class increaseEmailLength1628793832497 implements MigrationInterface {
  name = 'increaseEmailLength1628793832497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "email" TYPE varchar(255)
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout"
      SET DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "email" TYPE varchar(64)
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."users"
      ALTER COLUMN "last_logout"
      SET DEFAULT now()
    `);
  }
}
