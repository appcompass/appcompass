import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700379356968 implements MigrationInterface {
  name = 'InitialMigration1700379356968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "auth"."user_role" (
        "user_id" uuid NOT NULL,
        "role_id" uuid NOT NULL,
        CONSTRAINT "user_role_role_id_user_id_pkey" PRIMARY KEY ("user_id", "role_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "label" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "system" boolean NOT NULL DEFAULT false,
        "assignable_by_id" uuid,
        CONSTRAINT "roles_name_unique" UNIQUE ("name"),
        CONSTRAINT "roles_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."user_permission" (
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "user_permission_permission_id_user_id_pkey" PRIMARY KEY ("user_id", "permission_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "label" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "system" boolean NOT NULL DEFAULT false,
        "assignable_by_id" uuid,
        CONSTRAINT "permissions_name_unique" UNIQUE ("name"),
        CONSTRAINT "permissions_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."audit_permission" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "permission_id" uuid NOT NULL,
        "change_type" character varying(12) NOT NULL,
        "change_by_user_id" uuid NOT NULL,
        "original_data" jsonb,
        "new_data" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "audit_permission_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."audit_role" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role_id" uuid NOT NULL,
        "change_type" character varying(12) NOT NULL,
        "change_by_user_id" uuid NOT NULL,
        "original_data" jsonb,
        "new_data" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "audit_role_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."audit_user_permission" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "change_type" character varying(12) NOT NULL,
        "change_by_user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "audit_user_permission_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."audit_role_permission" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        "change_type" character varying(12) NOT NULL,
        "change_by_user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "audit_role_permission_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."audit_user_role" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid varying NOT NULL,
        "role_id" uuid NOT NULL,
        "change_type" character varying(12) NOT NULL,
        "change_by_user_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "audit_user_role_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "auth"."role_permission" (
        "role_id" uuid NOT NULL,
        "permission_id" uuid NOT NULL,
        CONSTRAINT "role_permission_permission_id_role_id_pkey" PRIMARY KEY ("role_id", "permission_id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_role_id_index" ON "auth"."role_permission" ("role_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_permission_id_index" ON "auth"."role_permission" ("permission_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."user_role"
      ADD CONSTRAINT "user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."roles"
      ADD CONSTRAINT "roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."user_permission"
      ADD CONSTRAINT "user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."permissions"
      ADD CONSTRAINT "permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."role_permission"
      ADD CONSTRAINT "role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
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
      ALTER TABLE "auth"."role_permission" DROP CONSTRAINT "role_permission_role_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."permissions" DROP CONSTRAINT "permissions_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."user_permission" DROP CONSTRAINT "user_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."roles" DROP CONSTRAINT "roles_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "auth"."user_role" DROP CONSTRAINT "user_role_role_id_foreign"
    `);
    await queryRunner.query(`
      DROP INDEX "auth"."role_permission_permission_id_index"
    `);
    await queryRunner.query(`
      DROP INDEX "auth"."role_permission_role_id_index"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."role_permission"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."audit_user_role"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."audit_role_permission"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."audit_user_permission"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."audit_role"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."audit_permission"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."permissions"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."user_permission"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."roles"
    `);
    await queryRunner.query(`
      DROP TABLE "auth"."user_role"
    `);
  }
}
