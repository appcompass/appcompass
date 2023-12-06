import { EntitySchema } from 'typeorm';

import { AuditRolePermission as Entity } from '@appcompass/common/entities';

export const AuditRolePermission = new EntitySchema<Entity>({
  name: 'AuditRolePermission',
  tableName: 'audit_role_permission',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    roleId: {
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
