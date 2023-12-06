import { EntitySchema } from 'typeorm';

import { AuditPermission as Entity } from '@appcompass/common/entities';

export const AuditPermission = new EntitySchema<Entity>({
  name: 'AuditPermission',
  tableName: 'audit_permission',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
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
    originalData: {
      type: 'jsonb',
      nullable: true,
      readonly: true
    },
    newData: {
      type: 'jsonb',
      nullable: true,
      readonly: true
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    }
  }
});
