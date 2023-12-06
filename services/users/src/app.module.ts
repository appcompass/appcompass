import * as Joi from 'joi';

import {
  extendedJoi,
  LogInterserviceRequestsMiddleware,
  registerBaseModuleImports,
  registerBaseModuleProviders
} from '@appcompass/common';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './api/controllers/auth.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
import { UsersController } from './api/controllers/users.controller';
import { PasswordReset } from './api/entities/password-reset.entity';
import { UserLogin } from './api/entities/user-login.entity';
import { User } from './api/entities/user.entity';
import { JwtStrategy } from './api/jwt.strategy';
import { PasswordResetService } from './api/services/password-reset.service';
import { UserService } from './api/services/user.service';
import { UsersService } from './api/services/users.service';
import { RegistrationCodeValidator } from './api/validators/registration-code.validator';
import { ResetPasswordCodeNotUsedValidator } from './api/validators/reset-password-code-not-used';
import { EmailUsedValidator } from './api/validators/unique-email.validator';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string(),
        SERVICE_PORT: Joi.number().default(3000),
        SERVICE_INSTANCE_NUMBER: Joi.number().default(-1),
        ENV: Joi.string().default('local'),
        NODE_ENV: Joi.string().default('local'),
        GIT_HASH: Joi.string().default('latest'),
        GIT_TAG: Joi.string().default('latest'),
        PUBLIC_KEY: extendedJoi.string().required(),
        APP_CONFIG: extendedJoi.object().required(),
        INTERSERVICE_TRANSPORT_CONFIG: extendedJoi.object().required(),
        DB_CONFIG: extendedJoi.object().required()
      })
        .pattern(/_API_URL$/, Joi.string().uri())
        .options({ stripUnknown: true, convert: true })
    }),
    ...registerBaseModuleImports(__dirname, [User, UserLogin, PasswordReset])
  ],
  controllers: [AppController, AuthController, UsersController, InterServiceController],
  providers: [
    ...registerBaseModuleProviders(true),
    EmailUsedValidator,
    JwtStrategy,
    PasswordResetService,
    RegistrationCodeValidator,
    ResetPasswordCodeNotUsedValidator,
    UserService,
    UsersService
  ],
  exports: [TypeOrmModule, UserService, PasswordResetService, UsersService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogInterserviceRequestsMiddleware).forRoutes(InterServiceController);
  }
}
