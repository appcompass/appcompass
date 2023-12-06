import { DataSource } from 'typeorm';

import { Permission, Role } from '@appcompass/common/entities';
import { ConsoleLogger, Controller, Post, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';

import { RegisterRolesPayload } from '../dto/register-roles.dto';
import { UserIdPayload } from '../dto/user-id.dto';
import { PermissionsService } from '../services/permissions.service';
import { RolesService } from '../services/roles.service';
import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller()
@UseGuards(AuthGuard('interservice-api-key'))
@ApiExcludeController(true)
export class InterServiceController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly userAuthorizationService: UserAuthorizationService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post('authorization.permission.find-by')
  async findPermissionBy(@Payload() payload: Partial<Permission>) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.permissionsService.findBy(manager, payload);
    });
  }

  @Post('authorization.role.find-by')
  async findRoleBy(@Payload() payload: Partial<Role>) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.rolesService.findBy(manager, payload);
    });
  }

  @Post('authorization.register.roles')
  async registerRoles(@Payload() payload: RegisterRolesPayload) {
    const { data } = payload;
    return await this.dataSource.transaction(async (manager) => await this.rolesService.registerRoles(manager, data));
  }

  @Post('authorization.user.get-permission-names')
  async findByName(@Payload() payload: UserIdPayload) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userAuthorizationService.getAllPermissionNames(manager, payload);
    });
  }

  @Post('authorization.user.get-role-ids')
  async findUserRoles(@Payload() { userId }: UserIdPayload) {
    return await this.dataSource.transaction(async (manager) => {
      const roles = await this.userAuthorizationService.findAllRoles(manager, userId);
      return roles.map((role) => role.id);
    });
  }

  @Post('authorization.user.get-permission-ids')
  async findUserPermissions(@Payload() payload: UserIdPayload) {
    return await this.dataSource.transaction(async (manager) => {
      const permissions = await this.userAuthorizationService.getAllUserPermission(manager, payload);
      return permissions.map((permission) => permission.id);
    });
  }
}
