import { EntitySchema } from 'typeorm';

import { User as Entity } from '@appcompass/common/entities';

export const User = new EntitySchema<Entity>({
  name: 'User',
  tableName: 'users',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    active: {
      type: 'boolean',
      default: false,
      nullable: false
    },
    activationCode: {
      type: 'varchar',
      length: 64
    },
    activatedAt: {
      type: 'timestamp',
      nullable: true
    },
    lastLogin: {
      type: 'timestamp',
      nullable: true
    },
    lastLogout: {
      type: 'timestamp',
      nullable: false,
      default: () => 'now()'
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
    logins: {
      type: 'one-to-many',
      target: 'UserLogin',
      inverseSide: 'user'
    },
    passwordResets: {
      type: 'one-to-many',
      target: 'PasswordReset',
      inverseSide: 'user'
    }
  }
});
