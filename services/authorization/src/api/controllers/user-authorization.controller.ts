import { DataSource } from 'typeorm';

import {
  AuthenticatedRequest,
  NoEmptyPayloadPipe,
  Permissions,
  PermissionsGuard,
  unauthorizedResponseOptions,
  unprocessableEntityResponseOptions
} from '@appcompass/common';
import { Body, ConsoleLogger, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { setUser } from '../../db/query.utils';
import { PermissionIdsPayload } from '../dto/permission-ids.dto';
import { SyncResponse } from '../dto/sync-response.dto';
import { SyncUserRolesPayload } from '../dto/sync-user-roles.dto';
import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller({
  version: '1',
  path: 'user'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class UserAuthorizationController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly userAuthorizationService: UserAuthorizationService
  ) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id/roles')
  @Permissions('authorization.user-roles.list')
  async listUserRoles(@Param('id') id: string) {
    return await this.dataSource.transaction(async (manager) => {
      return this.userAuthorizationService.findAllRoles(manager, id);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id/permissions')
  @Permissions('authorization.user-permissions.list')
  async listUserPermissions(@Param('id') id: string) {
    return await this.dataSource.transaction(async (manager) => {
      return this.userAuthorizationService.findUserPermissions(manager, id);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id/roles/sync')
  @Permissions('authorization.user-roles.update')
  async syncUserRoles(
    @Param('id') id: string,
    @Body(new NoEmptyPayloadPipe()) payload: SyncUserRolesPayload,
    @Req() req: AuthenticatedRequest
  ): Promise<SyncResponse> {
    const { roleIds } = payload;
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      return await this.userAuthorizationService.syncRoles(manager, id, roleIds);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id/permissions/sync')
  @Permissions('authorization.user-permissions.update')
  async syncUserPermissions(
    @Param('id') id: string,
    @Body(new NoEmptyPayloadPipe()) payload: PermissionIdsPayload,
    @Req() req: AuthenticatedRequest
  ): Promise<SyncResponse> {
    const { permissionIds } = payload;
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      return await this.userAuthorizationService.syncPermissions(manager, id, permissionIds);
    });
  }
}
