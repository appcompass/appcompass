import { EntityManager, FindManyOptions } from 'typeorm';

import {
  AuditPermission,
  AuditRole,
  AuditRolePermission,
  AuditUserPermission,
  AuditUserRole
} from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogsService {
  async findAllAuditPermissions(
    manager: EntityManager,
    options?: FindManyOptions<AuditPermission>
  ): Promise<AuditPermission[]> {
    return await manager.getRepository(AuditPermission).find(options);
  }

  async findAllAuditRoles(manager: EntityManager, options?: FindManyOptions<AuditRole>): Promise<AuditRole[]> {
    return await manager.getRepository(AuditRole).find(options);
  }

  async findAllAuditUserPermissions(
    manager: EntityManager,
    options?: FindManyOptions<AuditUserPermission>
  ): Promise<AuditUserPermission[]> {
    return await manager.getRepository(AuditUserPermission).find(options);
  }

  async findAllAuditUserRoles(
    manager: EntityManager,
    options?: FindManyOptions<AuditUserRole>
  ): Promise<AuditUserRole[]> {
    return await manager.getRepository(AuditUserRole).find(options);
  }

  async findAllAuditRolePermissions(
    manager: EntityManager,
    options?: FindManyOptions<AuditRolePermission>
  ): Promise<AuditRolePermission[]> {
    return await manager.getRepository(AuditRolePermission).find(options);
  }
}
