import { MigrationInterface, QueryRunner } from 'typeorm';

import { AuditDataChangeType } from '@appcompass/common';

import { dbUserIdVarName } from '../query.utils';

export class addsAuditRoleEntry1700379356988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          CREATE OR REPLACE FUNCTION auth.adds_audit_role_entry() RETURNS TRIGGER AS
          $BODY$
          DECLARE
            v_old_data  JSON;
            v_new_data  JSON;
            v_change_by text := current_setting('${dbUserIdVarName}', true);
          BEGIN
            IF (v_change_by is null) THEN
              v_change_by := 0;
            END IF;
            IF (TG_OP = 'INSERT') THEN
              v_new_data := row_to_json(NEW.*);
              INSERT INTO auth.audit_role (role_id, change_type, change_by_user_id, new_data)
              VALUES (NEW.id, '${AuditDataChangeType.created}', v_change_by::INTEGER, v_new_data);
              RETURN NEW;
            ELSIF (TG_OP = 'UPDATE') THEN
              v_old_data := row_to_json(OLD.*);
              v_new_data := row_to_json(NEW.*);
              INSERT INTO auth.audit_role (role_id, change_type, change_by_user_id, original_data, new_data)
              VALUES (NEW.id, '${AuditDataChangeType.updated}', v_change_by::INTEGER, v_old_data, v_new_data);
              RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
              v_old_data := row_to_json(OLD.*);
              INSERT INTO auth.audit_role (role_id, change_type, change_by_user_id, original_data)
              VALUES (OLD.id, '${AuditDataChangeType.deleted}', v_change_by::INTEGER, v_old_data);
              RETURN OLD;
            ELSE
              RAISE WARNING '[auth.adds_audit_role_entry] - Other action occurred: %, at %',TG_OP,now();
              RETURN NULL;
            END IF;
          EXCEPTION
            WHEN data_exception THEN
              RAISE WARNING '[auth.adds_audit_role_entry] - UDF ERROR [DATA EXCEPTION] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN unique_violation THEN
              RAISE WARNING '[auth.adds_audit_role_entry] - UDF ERROR [UNIQUE] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN OTHERS THEN
              RAISE WARNING '[auth.adds_audit_role_entry] - UDF ERROR [OTHER] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
          END;
          $BODY$ LANGUAGE PLPGSQL;

          CREATE TRIGGER add_audit_role_entry
            AFTER INSERT OR UPDATE OR DELETE
            ON auth.roles
            FOR EACH ROW
          EXECUTE PROCEDURE auth.adds_audit_role_entry();
          `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION auth.adds_audit_permission_entry() CASCADE');
  }
}
