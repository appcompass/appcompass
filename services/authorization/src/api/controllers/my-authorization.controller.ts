import { DataSource } from 'typeorm';

import {
  AuthenticatedRequest,
  unauthorizedResponseOptions,
  unprocessableEntityResponseOptions
} from '@appcompass/common';
import { ConsoleLogger, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller({
  version: '1',
  path: 'my-authorization'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class MyAuthorizationController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly userAuthorizationService: UserAuthorizationService
  ) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard())
  @Get('roles')
  async listUserRoles(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.dataSource.transaction(async (manager) => {
      return this.userAuthorizationService.getAllRoleNames(manager, { userId });
    });
  }

  @UseGuards(AuthGuard())
  @Get('permissions')
  async listUserPermissions(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.dataSource.transaction(async (manager) => {
      return this.userAuthorizationService.getAllPermissionNames(manager, { userId });
    });
  }
}
