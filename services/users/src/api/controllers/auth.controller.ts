import { DataSource } from 'typeorm';

import { NoEmptyPayloadPipe, notFoundResponseOptions, unprocessableEntityResponseOptions } from '@appcompass/common';
import { Body, ConsoleLogger, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiNotFoundResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { ConfirmRegistrationDto } from '../dto/auth-confirm-registration.dto';
import { ForgotPasswordDto } from '../dto/auth-forgot-password.dto';
import { RegisterUserDto } from '../dto/auth-register.dto';
import { ResetPasswordDto } from '../dto/auth-reset-password.dto';
import { UserService } from '../services/user.service';

@Controller({ version: '1' })
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class AuthController {
  constructor(
    private dataSource: DataSource,
    private readonly logger: ConsoleLogger,
    private readonly userService: UserService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post('register')
  async register(@Body(new NoEmptyPayloadPipe()) payload: RegisterUserDto) {
    return await this.dataSource.transaction(async (manager) => {
      const { activationCode, userId, email } = await this.userService.register(manager, payload);

      this.logger.log(`User '${email}' (id: '${userId}') registered successfully.  Activation Code: ${activationCode}`);
      // TODO: not used, however if we wish to use it we need to add event support.
      // await this.messagingService.emitAsync('users.user.registered', { userId, email, activationCode });

      return { userId };
    });
  }

  @Get('confirm-registration')
  @ApiNotFoundResponse(notFoundResponseOptions)
  async confirmRegistration(@Query() { code }: ConfirmRegistrationDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.confirmRegistration(manager, code);
    });
  }

  @Post('forgot-password')
  @ApiNotFoundResponse(notFoundResponseOptions)
  async forgotPassword(@Body(new NoEmptyPayloadPipe()) { email }: ForgotPasswordDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.forgotPassword(manager, email);
    });
  }

  @Post('reset-password')
  @ApiNotFoundResponse(notFoundResponseOptions)
  async resetPassword(@Body(new NoEmptyPayloadPipe()) { code, password }: ResetPasswordDto) {
    return await this.dataSource.transaction(async (manager) => {
      return await this.userService.resetPassword(manager, { code, password });
    });
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Request() req) {
    const { email, lastLogin, id } = req.user;
    const emailHash = this.userService.createHash(email);
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}`;
    return { id, email, lastLogin, gravatarUrl };
  }
}
