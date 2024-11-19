import { EntitySchema } from 'typeorm';

import { Role as Entity } from '@appcompass/entities';

export const Role = new EntitySchema<Entity>({
  name: 'Role',
  tableName: 'roles',
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
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'role_permission',
        joinColumn: {
          name: 'role_id',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'permission_id',
          referencedColumnName: 'id'
        }
      }
    },
    roleToUsers: {
      type: 'one-to-many',
      target: 'UserRole',
      joinColumn: {
        name: 'role_id',
        referencedColumnName: 'id'
      }
    }
  }
});
