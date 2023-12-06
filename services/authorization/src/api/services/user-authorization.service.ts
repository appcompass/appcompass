import { EntityManager, In } from 'typeorm';

import { existsQuery } from '@appcompass/common';
import { Permission, Role, UserPermission, UserRole } from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';

import { UserIdPayload } from '../dto/user-id.dto';

@Injectable()
export class UserAuthorizationService {
  async getAllUserPermission(manager: EntityManager, { userId }: UserIdPayload): Promise<Permission[]> {
    const permissions = await this.findUserPermissions(manager, userId);
    const roles = await this.findAllRoles(manager, userId, true);
    return [...permissions, ...roles.flatMap((role) => role.permissions)];
  }

  async getAllRoleNames(manager: EntityManager, { userId }: UserIdPayload): Promise<string[]> {
    const roles = await this.findAllRoles(manager, userId);
    return roles.map((role) => role.name);
  }

  async getAllPermissionNames(manager: EntityManager, { userId }: UserIdPayload): Promise<string[]> {
    const permissions = await this.getAllUserPermission(manager, { userId });
    return permissions.map((permission) => permission.name);
  }

  async findAllRoles(manager: EntityManager, userId: string, withPermissions: boolean = false): Promise<Role[]> {
    const query = manager
      .getRepository(Role)
      .createQueryBuilder('role')
      .where(
        existsQuery(
          manager
            .getRepository(UserRole)
            .createQueryBuilder('user_role')
            .where('user_role.user_id = :userId and user_role.role_id = role.id')
        )
      )
      .setParameter('userId', userId);
    return await (withPermissions ? query.leftJoinAndSelect('role.permissions', 'permissions') : query).getMany();
  }

  async findUserPermissions(manager: EntityManager, userId: string): Promise<Permission[]> {
    return await manager
      .getRepository(Permission)
      .createQueryBuilder('permission')
      .where(
        existsQuery(
          manager
            .getRepository(UserPermission)
            .createQueryBuilder('user_permission')
            .where('user_permission.user_id = :userId and user_permission.permission_id = permission.id')
        )
      )
      .setParameter('userId', userId)
      .getMany();
  }

  async syncRoles(manager: EntityManager, userId: string, ids: string[]) {
    const existingIds = (await manager.getRepository(UserRole).find({ where: { userId } })).map(
      (userRole) => userRole.roleId
    );
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));

    if (removed.length)
      await manager
        .createQueryBuilder()
        .delete()
        .from(UserRole)
        .where({ userId, roleId: In(removed) })
        .execute();
    if (added.length)
      await manager.insert(
        UserRole,
        added.map((roleId) => ({ roleId, userId }))
      );
    return {
      removed,
      added,
      unchanged
    };
  }

  async syncPermissions(manager: EntityManager, userId: string, ids: string[]) {
    const existingIds = (await manager.getRepository(UserPermission).find({ where: { userId } })).map(
      (userPermission) => userPermission.permissionId
    );
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));

    if (removed.length)
      await manager
        .createQueryBuilder()
        .delete()
        .from(UserPermission)
        .where({ userId, permissionId: In(removed) })
        .execute();
    if (added.length)
      await manager.insert(
        UserPermission,
        added.map((permissionId) => ({ permissionId, userId }))
      );
    return {
      removed,
      added,
      unchanged
    };
  }
}
