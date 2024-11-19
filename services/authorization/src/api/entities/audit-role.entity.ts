import { EntitySchema } from 'typeorm';

import { AuditRole as Entity } from '@appcompass/entities';

export const AuditRole = new EntitySchema<Entity>({
  name: 'AuditRole',
  tableName: 'audit_role',
  target: Entity,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    roleId: {
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
