import * as Joi from 'joi';

import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './api/controllers/auth.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
import { UsersController } from './api/controllers/users.controller';
import { PasswordReset } from './api/entities/password-reset.entity';
import { UserLogin } from './api/entities/user-login.entity';
import { User } from './api/entities/user.entity';
import { PasswordResetService } from './api/services/password-reset.service';
import { UserService } from './api/services/user.service';
import { UsersService } from './api/services/users.service';
import { OrderQueryValidator } from './api/validators/order-query-string.validator';
import { RegistrationCodeValidator } from './api/validators/registration-code.validator';
import { ResetPasswordCodeNotUsedValidator } from './api/validators/reset-password-code-not-used';
import { SameAsValidator } from './api/validators/same-as.validator';
import { EmailUsedValidator } from './api/validators/unique-email.validator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { DBNamingStrategy } from './db/naming.strategy';
import { MessagingService } from './messaging/messaging.service';

// TODO: move to @appcompass/config
const extendedJoi = Joi.extend(
  (joi) => ({
    type: 'object',
    base: joi.object(),
    coerce(value) {
      try {
        return { value: JSON.parse(value) };
      } catch (error) {
        return { error };
      }
    }
  }),
  (joi) => ({
    type: 'string',
    base: joi.string(),
    coerce(value) {
      try {
        return {
          value: value.replace(/\\n/g, '\n')
        };
      } catch (error) {
        return { error };
      }
    }
  })
);

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVICE_NAME: Joi.string(),
        SERVICE_PORT: Joi.number().default(3000),
        ENV: Joi.string().default('local'),
        NODE_ENV: Joi.string().default('local'),
        GIT_HASH: Joi.string().default('latest'),
        GIT_TAG: Joi.string().default('latest'),
        PUBLIC_KEY: extendedJoi.string().required(),
        APP_CONFIG: extendedJoi.object().required(),
        INTERSERVICE_TRANSPORT_CONFIG: extendedJoi.object().required(),
        DB_CONFIG: extendedJoi.object().required()
      }).options({ stripUnknown: true, convert: true })
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('DB_CONFIG'),
        schema: 'users',
        namingStrategy: new DBNamingStrategy(),
        entities: [`${__dirname}/../**/*.entity{.js,.ts}`],
        migrations: [`${__dirname}/migrations/*{.js,.ts}`],
        cli: {
          entitiesDir: 'src/db/entities',
          migrationsDir: 'src/db/migrations',
          subscribersDir: 'src/db/subscribers'
        }
      })
    }),
    TypeOrmModule.forFeature([User, UserLogin, PasswordReset]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AppController, AuthController, UsersController, InterServiceController],
  providers: [
    AppService,
    JwtStrategy,
    UserService,
    PasswordResetService,
    UsersService,
    MessagingService,
    EmailUsedValidator,
    SameAsValidator,
    OrderQueryValidator,
    RegistrationCodeValidator,
    ResetPasswordCodeNotUsedValidator,
    ConsoleLogger
  ],
  exports: [TypeOrmModule, UserService, PasswordResetService, UsersService]
})
export class AppModule {}
