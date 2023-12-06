import { EntitySchema } from 'typeorm';

import { UserPermission as Entity } from '@appcompass/common/entities';

export const UserPermission = new EntitySchema<Entity>({
  name: 'UserPermission',
  tableName: 'user_permission',
  target: Entity,
  columns: {
    userId: {
      type: 'uuid',
      primary: true,
      nullable: false
    },
    permissionId: {
      type: 'uuid',
      primary: true,
      nullable: false
    }
  },
  relations: {
    permission: {
      target: 'Permission',
      type: 'many-to-one',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'permission_id',
        referencedColumnName: 'id'
      }
    }
  }
});
