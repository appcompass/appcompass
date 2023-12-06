import { EntityManager, FindOptionsWhere } from 'typeorm';

import { FilterAllQuery, ResultsAndTotal } from '@appcompass/common';
import { User } from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll(manager: EntityManager, options: FilterAllQuery<User>): Promise<ResultsAndTotal<User>> {
    const { skip, take, order, filter } = options;
    const params = { filter: `%${filter}%` };
    const baseQuery = manager.createQueryBuilder().select('u').from(User, 'u');
    const query = (filter ? baseQuery.where('u.email LIKE :filter') : baseQuery).setParameters(params);
    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
  }

  async findBy(manager: EntityManager, where: FindOptionsWhere<User>) {
    return await manager.getRepository(User).findOneOrFail({ where });
  }

  async create(manager: EntityManager, data: Partial<User>) {
    return await manager.createQueryBuilder().insert().into(User).values(data).execute();
  }

  async update(manager: EntityManager, id: string, data: Partial<User>) {
    const { affected } = await manager.createQueryBuilder().update(User).set(data).where('id = :id', { id }).execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: string) {
    const { affected } = await manager.createQueryBuilder().delete().from(User).where('id = :id', { id }).execute();
    return { affected };
  }
}
