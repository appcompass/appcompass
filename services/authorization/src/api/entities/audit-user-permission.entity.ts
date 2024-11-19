import { EntitySchema } from 'typeorm';

import { AuditUserPermission as Entity } from '@appcompass/entities';

export const AuditUserPermission = new EntitySchema<Entity>({
  name: 'AuditUserPermission',
  tableName: 'audit_user_permission',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    userId: {
      type: 'uuid',
      nullable: false,
      readonly: true
    },
    permissionId: {
      type: 'uuid',
      nullable: false,
      readonly: true
    },
    changeType: {
      type: 'varchar',
      length: 12,
      nullable: false,
      readonly: true
    },
    changeByUserId: {
      type: 'uuid',
      nullable: false,
      readonly: true
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    }
  }
});
