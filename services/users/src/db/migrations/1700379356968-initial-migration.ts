import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700379356968 implements MigrationInterface {
  name = 'InitialMigration1700379356968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users"."password_resets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "code" character varying(64) NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "password_resets_code_unique" UNIQUE ("code"),
        CONSTRAINT "password_resets_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "users"."users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "active" boolean NOT NULL DEFAULT false,
        "activation_code" character varying(64) NOT NULL,
        "activated_at" TIMESTAMP,
        "last_login" TIMESTAMP,
        "last_logout" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE ("email"),
        CONSTRAINT "users_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "users"."user_logins" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "login_at" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" uuid,
        CONSTRAINT "user_logins_id_pkey" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."password_resets"
      ADD CONSTRAINT "password_resets_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."user_logins"
      ADD CONSTRAINT "user_logins_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"."user_logins" DROP CONSTRAINT "user_logins_user_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"."password_resets" DROP CONSTRAINT "password_resets_user_id_foreign"
    `);
    await queryRunner.query(`
      DROP TABLE "users"."user_logins"
    `);
    await queryRunner.query(`
      DROP TABLE "users"."users"
    `);
    await queryRunner.query(`
      DROP TABLE "users"."password_resets"
    `);
  }
}
