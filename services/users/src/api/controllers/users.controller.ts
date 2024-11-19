import { DataSource } from 'typeorm';

import {
  NoEmptyPayloadPipe,
  OrderQuery,
  Permissions,
  PermissionsGuard,
  QueryOrderPipe,
  unauthorizedResponseOptions,
  unprocessableEntityResponseOptions
} from '@appcompass/common';
import { User } from '@appcompass/entities';
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
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { CreateUserPayload } from '../dto/user-create.dto';
import { UpdateUserPublicDto } from '../dto/user-update.dto';
import { UserService } from '../services/user.service';
import { UsersService } from '../services/users.service';

@Controller({
  version: '1',
  path: 'users'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class UsersController {
  constructor(
    private dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly userService: UserService,
    private readonly usersService: UsersService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Post()
  @Permissions('users.user.create')
  async create(@Body() payload: CreateUserPayload) {
    const password = await this.userService.setPassword(payload.password);
    const data = {
      ...payload,
      password,
      activationCode: '',
      active: true
    };
    return await this.dataSource.transaction(async (manager) => {
      const { generatedMaps } = await this.usersService.create(manager, data);
      const [{ id }] = generatedMaps;

      return await this.usersService.findBy(manager, { id });
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get()
  @Permissions('users.user.list')
  async list(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<User>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const { data, total } = await this.usersService.findAll(manager, { skip, take, order, filter });
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
  @Permissions('users.user.read')
  async findById(@Param('id') id: string) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        return await this.usersService.findBy(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id')
  @Permissions('users.user.update')
  async updateRequest(@Param('id') id: string, @Body(new NoEmptyPayloadPipe()) payload: UpdateUserPublicDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        return await this.userService.updateUser(manager, id, payload);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Delete(':id')
  @Permissions('users.user.delete')
  async delete(@Param('id') id: string) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        return await this.usersService.delete(manager, id);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }
}
