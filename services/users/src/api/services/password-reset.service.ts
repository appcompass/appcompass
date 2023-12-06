import { EntityManager, FindOptionsWhere } from 'typeorm';

import { PasswordReset } from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordResetService {
  async findBy(manager: EntityManager, conditions: FindOptionsWhere<PasswordReset>) {
    return await manager.getRepository(PasswordReset).findOne({ where: conditions });
  }

  async create(manager: EntityManager, data: Partial<PasswordReset>) {
    return await manager.insert(PasswordReset, data);
  }

  async update(manager: EntityManager, id: string, data: Partial<PasswordReset>) {
    const { affected } = await manager
      .createQueryBuilder()
      .update(PasswordReset)
      .set(data)
      .where('id = :id', { id })
      .execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: string) {
    const { affected } = await manager
      .createQueryBuilder()
      .delete()
      .from(PasswordReset)
      .where('id = :id', { id })
      .execute();
    return { affected };
  }
}
