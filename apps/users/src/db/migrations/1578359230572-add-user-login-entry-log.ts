import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserLoginEntryLog1578359230572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION auth.adds_user_login_entry() RETURNS TRIGGER AS
      $BODY$
      BEGIN
        IF (old.last_login != new.last_login) THEN
          INSERT INTO auth.user_logins (user_id, login_at)
          VALUES (new.id, new.last_login);
        END IF;
        RETURN new;
      END;
      $BODY$ LANGUAGE PLPGSQL;

      CREATE TRIGGER add_user_login_entry
        AFTER UPDATE
        ON auth.users
        FOR EACH ROW
      EXECUTE PROCEDURE auth.adds_user_login_entry();
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION auth.adds_user_login_entry() CASCADE
    `);
  }
}
