import * as Joi from 'joi';

import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './api/controllers/auth.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
import { AuthService } from './api/services/auth.service';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { LocalStrategy } from './api/strategies/local.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
        PRIVATE_KEY: extendedJoi.string().required(),
        PASSPHRASE: Joi.string().required(),
        AUTH_EXPIRES_IN: Joi.number(),
        APP_CONFIG: extendedJoi.object().required(),
        INTERSERVICE_TRANSPORT_CONFIG: extendedJoi.object().required()
      }).options({ stripUnknown: true, convert: true })
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    })
  ],
  controllers: [AppController, AuthController, InterServiceController],
  providers: [AppService, ConfigService, JwtStrategy, LocalStrategy, MessagingService, AuthService, ConsoleLogger]
})
export class AppModule {}
