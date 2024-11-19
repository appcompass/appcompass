import { EntityManager, FindOptionsWhere, ObjectLiteral } from 'typeorm';

import { FilterAllQuery, ResultsAndTotal } from '@appcompass/common';
import { Permission, Role } from '@appcompass/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RegisterRoles } from '../dto/register-roles.dto';

@Injectable()
export class RolesService {
  constructor(private readonly configService: ConfigService) {}

  async findAll(manager: EntityManager, options: FilterAllQuery<Role>): Promise<ResultsAndTotal<Role>> {
    const { skip, take, order, filter } = options;
    const params = { filter: `%${filter}%` };
    const baseQuery = manager.createQueryBuilder().select('r').from(Role, 'r');
    const query = (
      filter ? baseQuery.where('r.name LIKE :filter or r.label LIKE :filter or r.description LIKE :filter') : baseQuery
    ).setParameters(params);
    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
  }

  async findAllWhere(manager: EntityManager, where: ObjectLiteral): Promise<Role[]> {
    return await manager.createQueryBuilder().select('r').from(Role, 'r').where(where).getMany();
  }

  async findBy(manager: EntityManager, where: FindOptionsWhere<Role>): Promise<Role | undefined> {
    return await manager.getRepository(Role).findOne({ where });
  }

  async findOne(manager: EntityManager, where: FindOptionsWhere<Role>): Promise<Role | undefined> {
    return await manager.getRepository(Role).findOneOrFail({ where });
  }

  async create(manager: EntityManager, data: Partial<Role>) {
    return await manager.insert(Role, data);
  }

  async update(manager: EntityManager, id: string, data: Partial<Role>, system: boolean = false) {
    const { affected } = await manager
      .createQueryBuilder()
      .update(Role)
      .set(data)
      .where('id = :id and system = :system', { id, system })
      .execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: string, system: boolean = false) {
    const { affected } = await manager
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where('id = :id and system = :system', { id, system })
      .execute();
    return { affected };
  }

  async getPermissions(manager: EntityManager, id: string, options?: FilterAllQuery<Permission>) {
    const { schema } = this.configService.get('DB_CONFIG');
    const { skip, take, order, filter } = options;
    const params = { id, filter: `%${filter}%` };
    const query = manager
      .createQueryBuilder()
      .select('p')
      .from(Permission, 'p')
      .where(
        `exists (select 1 from ${schema}.role_permission rp where rp.role_id = :id and rp.permission_id = p.id)` +
          (filter ? 'and (p.name LIKE :filter or p.label LIKE :filter or p.description LIKE :filter)' : '')
      )
      .setParameters(params);

    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
  }

  async syncPermissions(manager: EntityManager, id: string, ids: string[]) {
    const query = manager.createQueryBuilder().relation(Role, 'permissions').of(id);
    const existingIds = (await query.loadMany<Permission>()).map((permission) => permission.id);
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));
    await query.addAndRemove(added, removed);

    return {
      removed,
      added,
      unchanged
    };
  }

  async registerRoles(manager: EntityManager, payload: RegisterRoles[]) {
    for (let index = 0; index < payload.length; index++) {
      await this.registerRole(manager, payload[index]);
    }
  }

  async registerRole(manager: EntityManager, payload: RegisterRoles) {
    const { permissions, ...roleData } = payload;
    const roleId = await this.findOrCreateRoleId(manager, roleData);
    const permissionIds = await this.findOrCreatePermissionIds(manager, permissions);
    await this.syncPermissions(manager, roleId, permissionIds);
  }

  async findOrCreatePermissionIds(manager: EntityManager, payload: Partial<Permission>[]) {
    const { identifiers } = await manager
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values(payload)
      .orUpdate(['label', 'description', 'system'], ['name'])
      .execute();
    return identifiers.map((row) => row.id);
  }

  async findOrCreateRoleId(manager: EntityManager, payload: Partial<Role>) {
    const { identifiers } = await manager
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(payload)
      .orUpdate(['label', 'description', 'system'], ['name'])
      .execute();
    const [row] = identifiers;

    return row.id;
  }
}
