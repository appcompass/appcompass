import { EntitySchema } from 'typeorm';

import { UserRole as Entity } from '@appcompass/entities';

export const UserRole = new EntitySchema<Entity>({
  name: 'UserRole',
  tableName: 'user_role',
  target: Entity,
  columns: {
    userId: {
      type: 'uuid',
      primary: true,
      nullable: false
    },
    roleId: {
      type: 'uuid',
      primary: true,
      nullable: false
    }
  },
  relations: {
    role: {
      target: 'Role',
      type: 'many-to-one',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'role_id',
        referencedColumnName: 'id'
      }
    }
  }
});
