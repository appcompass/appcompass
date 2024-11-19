import { DataSource } from 'typeorm';

import {
  AuthenticatedRequest,
  NoEmptyPayloadPipe,
  OrderQuery,
  PaginatedResponse,
  Permissions,
  PermissionsGuard,
  QueryOrderPipe,
  RowsAffectedResponse,
  unauthorizedResponseOptions,
  unprocessableEntityResponseOptions
} from '@appcompass/common';
import { Permission, Role } from '@appcompass/entities';
import {
  Body,
  ConsoleLogger,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { setUser } from '../../db/query.utils';
import { IdResponse } from '../dto/id.dto';
import { PermissionIdsPayload } from '../dto/permission-ids.dto';
import { CreateRolePayload } from '../dto/role-create.dto';
import { UpdateRolePayload } from '../dto/role-update.dto';
import { SyncResponse } from '../dto/sync-response.dto';
import { NotSystemRolePipe } from '../pipes/not-system-role.pipe';
import { RolesService } from '../services/roles.service';

@Controller({
  version: '1',
  path: 'roles'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class RolesController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly rolesService: RolesService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Post()
  @Permissions('authorization.role.create')
  async create(@Body() payload: CreateRolePayload, @Req() req: AuthenticatedRequest): Promise<IdResponse> {
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      const { generatedMaps } = await this.rolesService.create(manager, payload);
      const [{ id }] = generatedMaps;

      return { id };
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get()
  @Permissions('authorization.role.list')
  async list(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<Role>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ): Promise<PaginatedResponse<Role>> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const { data, total } = await this.rolesService.findAll(manager, { skip, take, order, filter });
        return {
          data,
          pagination: {
            total,
            skip,
            take
          }
        };
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id')
  @Permissions('authorization.role.read')
  async findById(@Param('id') id: string) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        return await this.rolesService.findOne(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id')
  @Permissions('authorization.role.update')
  async updateById(
    @Param('id') id: string,
    @Body(new NoEmptyPayloadPipe()) payload: UpdateRolePayload,
    @Req() req: AuthenticatedRequest
  ): Promise<RowsAffectedResponse> {
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.rolesService.update(manager, id, payload);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Delete(':id')
  @Permissions('authorization.role.delete')
  async deleteById(
    @Param('id', NotSystemRolePipe) id: string,
    @Req() req: AuthenticatedRequest
  ): Promise<RowsAffectedResponse> {
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.rolesService.delete(manager, id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id/permissions/sync')
  @Permissions('authorization.role.update', 'authorization.permission.read')
  async syncPermissions(
    @Param('id', NotSystemRolePipe) id: string,
    @Body(new NoEmptyPayloadPipe()) payload: PermissionIdsPayload,
    @Req() req: AuthenticatedRequest
  ): Promise<SyncResponse> {
    return await this.dataSource.transaction(async (manager) => {
      await setUser(req.user, manager);
      const { permissionIds } = payload;
      try {
        return await this.rolesService.syncPermissions(manager, id, permissionIds);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id/permissions')
  @Permissions('authorization.role.read', 'authorization.permission.list')
  async getPermissions(
    @Param('id') id: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<Permission>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ): Promise<PaginatedResponse<Permission>> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const { data, total } = await this.rolesService.getPermissions(manager, id, { skip, take, order, filter });
        return {
          data,
          pagination: {
            total,
            skip,
            take
          }
        };
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }
}
