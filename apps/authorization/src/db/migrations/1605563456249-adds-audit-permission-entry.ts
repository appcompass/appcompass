import { MigrationInterface, QueryRunner } from 'typeorm';

import { AuditDataChangeType } from '../../api/api.types';
import { dbUserIdVarName } from '../query.utils';

export class addsAuditPermissionEntry1605563456249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          CREATE OR REPLACE FUNCTION users.adds_audit_permission_entry() RETURNS TRIGGER AS
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
              INSERT INTO users.audit_permission (permission_id, change_type, change_by_user_id, new_data)
              VALUES (NEW.id, '${AuditDataChangeType.created}', v_change_by::INTEGER, v_new_data);
              RETURN NEW;
            ELSIF (TG_OP = 'UPDATE') THEN
              v_old_data := row_to_json(OLD.*);
              v_new_data := row_to_json(NEW.*);
              INSERT INTO users.audit_permission (permission_id, change_type, change_by_user_id, original_data, new_data)
              VALUES (NEW.id, '${AuditDataChangeType.updated}', v_change_by::INTEGER, v_old_data, v_new_data);
              RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
              v_old_data := row_to_json(OLD.*);
              INSERT INTO users.audit_permission (permission_id, change_type, change_by_user_id, original_data)
              VALUES (OLD.id, '${AuditDataChangeType.deleted}', v_change_by::INTEGER, v_old_data);
              RETURN OLD;
            ELSE
              RAISE WARNING '[users.adds_audit_permission_entry] - Other action occurred: %, at %',TG_OP,now();
              RETURN NULL;
            END IF;
          EXCEPTION
            WHEN data_exception THEN
              RAISE WARNING '[users.adds_audit_permission_entry] - UDF ERROR [DATA EXCEPTION] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN unique_violation THEN
              RAISE WARNING '[users.adds_audit_permission_entry] - UDF ERROR [UNIQUE] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN OTHERS THEN
              RAISE WARNING '[users.adds_audit_permission_entry] - UDF ERROR [OTHER] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
          END;
          $BODY$ LANGUAGE PLPGSQL;

          CREATE TRIGGER add_audit_permission_entry
            AFTER INSERT OR UPDATE OR DELETE
            ON users.permissions
            FOR EACH ROW
          EXECUTE PROCEDURE users.adds_audit_permission_entry();
          `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION users.adds_audit_permission_entry() CASCADE');
  }
}
