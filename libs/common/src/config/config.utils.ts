import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as Joi from 'joi';
import { resolve } from 'path';

import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  INestApplication,
  ModuleMetadata,
  Provider,
  Type,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, NestFactory, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { RedisModule } from '@songkeys/nestjs-redis';
import {
  makeCounterProvider,
  makeGaugeProvider,
  makeHistogramProvider,
  makeSummaryProvider,
  PrometheusModule
} from '@willsoto/nestjs-prometheus';

import { BearerApiKeyStrategy, InterserviceApiKeyStrategy, JwtStrategy } from '../auth';
import { DBNamingStrategy, QueryLogger } from '../db';
import { PrometheusInterceptor } from '../interceptors';
import { MessagingService } from '../messaging';
import { AppService } from '../services';
import { OrderQueryValidator, SameAsValidator } from '../validators';
import { CustomPrometheusController } from './custom-prometheus.controller';

export const extendedJoi = Joi.extend(
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

export async function createApp(AppModule: Type) {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}

export function applyConfigurations(app: INestApplication, serviceName: string) {
  app.enableVersioning({
    type: VersioningType.URI
  });
  app.setGlobalPrefix(serviceName);
}

export function applyValidators(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { exposeDefaultValues: true },
      whitelist: true,
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors, 'Validation Error')
    })
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

export function addSwaggerDocs(
  app: INestApplication,
  title: string,
  description: string,
  version: string,
  tag: string | [string, string],
  path: string,
  options?: SwaggerDocumentOptions
) {
  const tagInfo: [string, string] = typeof tag === 'object' ? tag : [tag, ''];
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addTag(...tagInfo)
    .build();
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup(path, app, document);
}

export function applySecurity(app: INestApplication, corsOptions: CorsOptions) {
  app.enableCors(corsOptions);

  app.use(helmet());
}

export function useCookies(app: INestApplication) {
  app.use(cookieParser());
}

export async function startApp(app: INestApplication, servicePort: number) {
  await app.startAllMicroservices();
  await app.listen(servicePort);
}

export function registerBaseModuleImports(
  dirname?: string,
  entities?: EntityClassOrSchema[],
  redis?: boolean
): ModuleMetadata['imports'] {
  return [
    PrometheusModule.register({
      controller: CustomPrometheusController
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ...(dirname && entities ? [TypeOrmModule.forFeature(entities)] : []),
    ...(dirname
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const dbConfig = configService.get('DB_CONFIG');
              return {
                ...dbConfig,
                logger: new QueryLogger(dbConfig.logging),
                namingStrategy: new DBNamingStrategy(),
                autoLoadEntities: true,
                migrations: [resolve(dirname, '**', 'migrations/*{.js,.ts}')],
                cli: {
                  entitiesDir: 'src/db/entities',
                  migrationsDir: 'src/db/migrations',
                  subscribersDir: 'src/db/subscribers'
                }
              };
            }
          })
        ]
      : []),
    ...(redis
      ? [
          RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
              config: {
                port: config.get('REDIS_PORT'),
                host: config.get('REDIS_HOST'),
                password: config.get('REDIS_PASSWORD'),
                db: 0
              }
            })
          })
        ]
      : [])
  ];
}

export function registerBaseModuleProviders(customJwtStrategy = false): Provider[] {
  return [
    AppService,
    BearerApiKeyStrategy,
    ConfigService,
    ConsoleLogger,
    InterserviceApiKeyStrategy,
    ...(customJwtStrategy ? [] : [JwtStrategy]),
    makeCounterProvider({
      name: 'request_total',
      help: 'request_total_help',
      labelNames: ['method', 'code', 'path']
    }),
    makeGaugeProvider({
      name: 'request_duration_seconds',
      help: 'request_duration_seconds_help',
      labelNames: ['method', 'code', 'path']
    }),
    makeHistogramProvider({
      name: 'request_duration_histogram',
      help: 'request_duration_histogram_help',
      labelNames: ['method', 'code', 'path']
    }),
    makeSummaryProvider({
      name: 'request_duration_summary',
      help: 'request_duration_summary_help',
      labelNames: ['method', 'code', 'path']
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: PrometheusInterceptor
    },
    MessagingService,
    OrderQueryValidator,
    SameAsValidator
  ];
}
