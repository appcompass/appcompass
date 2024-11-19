import { EntitySchema } from 'typeorm';

import { AuditUserRole as Entity } from '@appcompass/entities';

export const AuditUserRole = new EntitySchema<Entity>({
  name: 'AuditUserRole',
  tableName: 'audit_user_role',
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
    createdAt: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true
    }
  }
});
