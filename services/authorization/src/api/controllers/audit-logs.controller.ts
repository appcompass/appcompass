import { DataSource } from 'typeorm';

import {
  FilterListQuery,
  Permissions,
  PermissionsGuard,
  unauthorizedResponseOptions,
  unprocessableEntityResponseOptions
} from '@appcompass/common';
import { AuditPermission, AuditRole, AuditUserRole } from '@appcompass/common/entities';
import { ConsoleLogger, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { AuditLogsService } from '../services/audit-logs.service';

@Controller('audit')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class AuditLogsController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly auditLogsService: AuditLogsService
  ) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('permissions')
  @Permissions('authorization.audit.permission')
  async listAuditPermissions(@Query() query: FilterListQuery<AuditPermission>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await this.dataSource.transaction(async (manager) => {
      return this.auditLogsService.findAllAuditPermissions(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('roles')
  @Permissions('authorization.audit.role')
  async listAuditRoles(@Query() query: FilterListQuery<AuditRole>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await this.dataSource.transaction(async (manager) => {
      return this.auditLogsService.findAllAuditRoles(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('user-permissions')
  @Permissions('authorization.audit.user-permission')
  async listAuditUserPermissions(@Query() query: FilterListQuery<AuditPermission>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await this.dataSource.transaction(async (manager) => {
      return this.auditLogsService.findAllAuditUserPermissions(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('user-roles')
  @Permissions('authorization.audit.user-role')
  async listAuditUserRoles(@Query() query: FilterListQuery<AuditUserRole>, @Query('where') where: any) {
    const { skip, take, order } = query;
    const options = {
      where,
      skip: +skip,
      take: +take,
      order
    };
    return await this.dataSource.transaction(async (manager) => {
      return this.auditLogsService.findAllAuditUserRoles(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('role-permissions')
  @Permissions('authorization.audit.role-permission')
  async listAuditRolePermissions(@Query() query: FilterListQuery<AuditUserRole>, @Query('where') where: any) {
    const { skip, take, order } = query;
    const options = {
      where,
      skip: +skip,
      take: +take,
      order
    };
    return await this.dataSource.transaction(async (manager) => {
      return this.auditLogsService.findAllAuditRolePermissions(manager, options);
    });
  }
}
