import { MigrationInterface, QueryRunner } from 'typeorm';

import { AuditAuthAssignmentType } from '../../api/api.types';
import { dbUserIdVarName } from '../query.utils';

export class addsAuditUserPermissionEntry1605563456252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          CREATE OR REPLACE FUNCTION users.adds_audit_user_permission_entry() RETURNS TRIGGER AS
          $BODY$
          DECLARE
            v_change_by text := current_setting('${dbUserIdVarName}', true);
          BEGIN
            IF (v_change_by is null) THEN
              v_change_by := 0;
            END IF;
            IF (TG_OP = 'INSERT') THEN
              INSERT INTO users.audit_user_permission (user_id, permission_id, change_type, change_by_user_id)
              VALUES (NEW.user_id, NEW.permission_id, '${AuditAuthAssignmentType.assigned}', v_change_by::INTEGER);
              RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
              INSERT INTO users.audit_user_permission (user_id, permission_id, change_type, change_by_user_id)
              VALUES (OLD.user_id, OLD.permission_id, '${AuditAuthAssignmentType.revoked}', v_change_by::INTEGER);
              RETURN OLD;
            ELSE
              RAISE WARNING '[users.adds_audit_user_permission_entry] - Other action occurred: %, at %',TG_OP,now();
              RETURN NULL;
            END IF;
          EXCEPTION
            WHEN data_exception THEN
              RAISE WARNING '[users.adds_audit_user_permission_entry] - UDF ERROR [DATA EXCEPTION] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN unique_violation THEN
              RAISE WARNING '[users.adds_audit_user_permission_entry] - UDF ERROR [UNIQUE] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN OTHERS THEN
              RAISE WARNING '[users.adds_audit_user_permission_entry] - UDF ERROR [OTHER] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
          END;
          $BODY$ LANGUAGE PLPGSQL;

          CREATE TRIGGER add_audit_user_permission_entry
            AFTER INSERT OR DELETE
            ON users.user_permission
            FOR EACH ROW
          EXECUTE PROCEDURE users.adds_audit_user_permission_entry();
          `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP FUNCTION users.adds_audit_user_permission_entry() CASCADE');
  }
}
