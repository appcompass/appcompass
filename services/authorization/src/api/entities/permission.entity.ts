import { EntitySchema } from 'typeorm';

import { Permission as Entity } from '@appcompass/entities';

export const Permission = new EntitySchema<Entity>({
  name: 'Permission',
  tableName: 'permissions',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    name: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false
    },
    label: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    description: {
      type: 'text',
      nullable: false
    },
    system: {
      type: 'boolean',
      default: false,
      nullable: false
    }
  },
  relations: {
    assignableBy: {
      type: 'many-to-one',
      target: 'Permission',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'assignable_by_id',
        referencedColumnName: 'id'
      }
    },
    roles: {
      type: 'many-to-many',
      target: 'roles',
      joinTable: {
        name: 'role_permission',
        joinColumn: {
          name: 'permission_id',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'role_id',
          referencedColumnName: 'id'
        }
      }
    },
    assignablePermissions: {
      type: 'one-to-many',
      target: 'Permission',
      inverseSide: 'assignableBy'
    },
    assignableRoles: {
      type: 'one-to-many',
      target: 'Role',
      inverseSide: 'assignableBy'
    },
    permissionToUsers: {
      type: 'one-to-many',
      target: 'UserPermission',
      inverseSide: 'permission'
    }
  }
});
