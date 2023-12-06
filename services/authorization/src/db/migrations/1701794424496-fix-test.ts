import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTest1701794424496 implements MigrationInterface {
  name = 'FixTest1701794424496';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth"."role_permission" DROP CONSTRAINT "role_permission_permission_id_foreign"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."role_permission"
            ADD CONSTRAINT "role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth"."role_permission" DROP CONSTRAINT "role_permission_permission_id_foreign"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."role_permission"
            ADD CONSTRAINT "role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
