import { EntityManager, FindOptionsWhere, ObjectLiteral } from 'typeorm';

import { FilterAllQuery, ResultsAndTotal } from '@appcompass/common';
import { Permission } from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  async findAll(manager: EntityManager, options: FilterAllQuery<Permission>): Promise<ResultsAndTotal<Permission>> {
    const { skip, take, order, filter } = options;
    const params = { filter: `%${filter}%` };
    const baseQuery = manager.createQueryBuilder().select('p').from(Permission, 'p');
    const query = (
      filter ? baseQuery.where('p.name LIKE :filter or p.label LIKE :filter or p.description LIKE :filter') : baseQuery
    ).setParameters(params);
    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
  }

  async findAllWhere(manager: EntityManager, where: ObjectLiteral): Promise<Permission[]> {
    return await manager.createQueryBuilder().select('p').from(Permission, 'p').where(where).getMany();
  }

  async findBy(manager: EntityManager, where: FindOptionsWhere<Permission>): Promise<Permission | undefined> {
    return await manager.getRepository(Permission).findOne({ where });
  }

  async findOne(manager: EntityManager, where: FindOptionsWhere<Permission>): Promise<Permission | undefined> {
    return await manager.getRepository(Permission).findOneOrFail({ where });
  }

  async create(manager: EntityManager, data: Partial<Permission>) {
    return await manager.insert(Permission, data);
  }

  async update(manager: EntityManager, id: string, data: Partial<Permission>, system: boolean = false) {
    const { affected } = await manager
      .createQueryBuilder()
      .update(Permission)
      .set(data)
      .where('id = :id and system = :system', { id, system })
      .execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: string, system: boolean = false) {
    const { affected } = await manager
      .createQueryBuilder()
      .delete()
      .from(Permission)
      .where('id = :id and system = :system', { id, system })
      .execute();
    return { affected };
  }
}
