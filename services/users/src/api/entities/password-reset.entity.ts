import { EntitySchema } from 'typeorm';

import { PasswordReset as Entity } from '@appcompass/common/entities';

export const PasswordReset = new EntitySchema<Entity>({
  name: 'PasswordReset',
  tableName: 'password_resets',
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
      nullable: false
    },
    code: {
      type: 'varchar',
      length: 64,
      unique: true,
      nullable: false
    },
    used: {
      type: 'boolean',
      default: false,
      nullable: false
    },
    createdAt: {
      type: 'timestamp',
      nullable: false,
      default: () => 'now()'
    },
    updatedAt: {
      type: 'timestamp',
      nullable: false,
      default: () => 'now()'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id'
      }
    }
  }
});
