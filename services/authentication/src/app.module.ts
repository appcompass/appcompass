import * as Joi from 'joi';

import {
  AuthService,
  extendedJoi,
  JwtRefreshCookieStrategy,
  LocalStrategy,
  LogInterserviceRequestsMiddleware,
  registerBaseModuleImports,
  registerBaseModuleProviders
} from '@appcompass/common';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './api/controllers/auth.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
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
        PRIVATE_KEY: extendedJoi.string().required(),
        PASSPHRASE: Joi.string().required(),
        AUTH_EXPIRES_IN: Joi.number(),
        APP_CONFIG: extendedJoi.object().required(),
        INTERSERVICE_TRANSPORT_CONFIG: extendedJoi.object().required()
      })
        .pattern(/_API_URL$/, Joi.string().uri())
        .options({ stripUnknown: true, convert: true })
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        publicKey: configService.get('PUBLIC_KEY'),
        privateKey: {
          key: configService.get('PRIVATE_KEY'),
          passphrase: configService.get('PASSPHRASE')
        },
        signOptions: {
          algorithm: 'RS512',
          expiresIn: configService.get('AUTH_EXPIRES_IN')
        }
      })
    }),
    ...registerBaseModuleImports()
  ],
  controllers: [AppController, AuthController, InterServiceController],
  providers: [...registerBaseModuleProviders(), AuthService, LocalStrategy, JwtRefreshCookieStrategy]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogInterserviceRequestsMiddleware).forRoutes(InterServiceController);
  }
}
