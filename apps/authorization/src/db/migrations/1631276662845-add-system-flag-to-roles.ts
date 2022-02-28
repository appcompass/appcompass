import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSystemFlagToRoles1631276662845 implements MigrationInterface {
  name = 'addSystemFlagToRoles1631276662845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"."user_role" DROP CONSTRAINT "auth_user_role_role_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles" DROP CONSTRAINT "auth_roles_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_permission" DROP CONSTRAINT "auth_user_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."permissions" DROP CONSTRAINT "auth_permissions_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission" DROP CONSTRAINT "auth_role_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission" DROP CONSTRAINT "auth_role_permission_role_id_foreign"
    `);
    await queryRunner.query(`
      DROP INDEX "users"."auth_role_permission_role_id_index"
    `);
    await queryRunner.query(`
      DROP INDEX "users"."auth_role_permission_permission_id_index"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles"
      ADD "system" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_role_id_index" ON "users"."role_permission" ("role_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_permission_id_index" ON "users"."role_permission" ("permission_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_role"
      ADD CONSTRAINT "user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "users"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles"
      ADD CONSTRAINT "roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_permission"
      ADD CONSTRAINT "user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."permissions"
      ADD CONSTRAINT "permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission"
      ADD CONSTRAINT "role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "users"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission"
      ADD CONSTRAINT "role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "users"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      update "users"."roles" set "system" = True where "name" = 'authorization.admin'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission" DROP CONSTRAINT "role_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission" DROP CONSTRAINT "role_permission_role_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."permissions" DROP CONSTRAINT "permissions_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_permission" DROP CONSTRAINT "user_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles" DROP CONSTRAINT "roles_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_role" DROP CONSTRAINT "user_role_role_id_foreign"
    `);
    await queryRunner.query(`
      DROP INDEX "users"."role_permission_permission_id_index"
    `);
    await queryRunner.query(`
      DROP INDEX "users"."role_permission_role_id_index"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles" DROP COLUMN "system"
    `);
    await queryRunner.query(`
      CREATE INDEX "auth_role_permission_permission_id_index" ON "users"."role_permission" ("permission_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "auth_role_permission_role_id_index" ON "users"."role_permission" ("role_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission"
      ADD CONSTRAINT "auth_role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "users"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."role_permission"
      ADD CONSTRAINT "auth_role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."permissions"
      ADD CONSTRAINT "auth_permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_permission"
      ADD CONSTRAINT "auth_user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."roles"
      ADD CONSTRAINT "auth_roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "users"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_role"
      ADD CONSTRAINT "auth_user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "users"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }
}
