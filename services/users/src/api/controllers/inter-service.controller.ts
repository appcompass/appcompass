import { DataSource, FindOptionsWhere } from 'typeorm';

import { User } from '@appcompass/common/entities';
import { Body, ConsoleLogger, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';

import { ConfirmRegistrationDto } from '../dto/auth-confirm-registration.dto';
import { ForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { RegisterUserDto } from '../dto/auth-register.dto';
import { ResetPasswordDto } from '../dto/auth-reset-password.dto';
import { CreateByEmailDto } from '../dto/create-by-email.dto';
import { UpdateUserPrivateDto } from '../dto/user-update.dto';
import { UserService } from '../services/user.service';
import { UsersService } from '../services/users.service';

@Controller()
@UseGuards(AuthGuard('interservice-api-key'))
@ApiExcludeController(true)
export class InterServiceController {
  constructor(
    protected readonly dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly userService: UserService,
    private readonly usersService: UsersService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post('users.user.find-or-create-by-email')
  async findOrCreateUser(@Body() { email }: CreateByEmailDto) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        return await this.usersService.findBy(manager, { email });
      } catch (error) {
        const password = await this.userService.setPassword(this.userService.randomPassword());
        const data = {
          email,
          password,
          activationCode: '',
          active: true
        };
        const { generatedMaps } = await this.usersService.create(manager, data);
        const [{ id }] = generatedMaps;
        return await this.usersService.findBy(manager, { id });
      }
    });
  }

  @Post('users.user.register')
  async register(@Body() payload: RegisterUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { activationCode, userId, email } = await this.userService.register(manager, payload);

      this.logger.log(`User '${email}' registered successfully.  Activation Code: ${activationCode}`);

      return { activationCode, userId, email };
    });
  }

  @Post('users.user.confirm-registration')
  async confirmRegistration(@Body() { code }: ConfirmRegistrationDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.confirmRegistration(manager, code);
    });
  }

  @Post('users.user.forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.forgotPassword(manager, email);
    });
  }

  @Post('users.user.reset-password')
  async resetPassword(@Body() { code, password }: ResetPasswordDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.resetPassword(manager, { code, password });
    });
  }

  @Post('users.user.find-by')
  async findBy(@Body() payload: FindOptionsWhere<User>) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const user = await this.usersService.findBy(manager, payload);
        if (user.id == undefined) {
          return undefined;
        }
        return new User(user);
      } catch (error) {
        return undefined;
      }
    });
  }

  @Post('users.user.update')
  async updateUser(@Body() payload: UpdateUserPrivateDto) {
    const { id, ...data } = payload;
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.updateUser(manager, id, data);
    });
  }

  @Post('users.user.exists')
  async doesUserExist(@Body() payload: FindOptionsWhere<User>) {
    return await this.dataSource.transaction(async (manager) => {
      try {
        await this.usersService.findBy(manager, payload);
        return { result: true };
      } catch (error) {
        return { result: false };
      }
    });
  }

  @Post('users.confirmation.register.roles')
  handleEventConfirmations(@Body() payload: boolean) {
    return payload
      ? this.logger.log('Service Roles registered successfully')
      : this.logger.error('Service Roles not registered successfully');
  }
}
