import { EntitySchema } from 'typeorm';

import { UserLogin as Entity } from '@appcompass/entities';

export const UserLogin = new EntitySchema<Entity>({
  name: 'UserLogin',
  tableName: 'user_logins',
  target: Entity,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
      nullable: false
    },
    loginAt: {
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
