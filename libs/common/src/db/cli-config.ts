import Joi from 'joi';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { extendedJoi } from '../config';
import { DBNamingStrategy } from './naming.strategy';

export const cliConfig = async (envFilePath: string) => {
  const app = await NestFactory.create<INestApplication>(
    ConfigModule.forRoot({
      envFilePath,
      validationSchema: Joi.object({
        DB_CONFIG: extendedJoi.object().required()
      }).options({ stripUnknown: true, convert: true })
    })
  );
  const configService = app.get(ConfigService);
  await app.close();

  const envFileParts = envFilePath.split('/');
  envFileParts.pop();
  const serviceBasePath = envFileParts.join('/');

  return {
    ...configService.get('DB_CONFIG'),
    synchronize: false,
    migrationsRun: false,
    namingStrategy: new DBNamingStrategy(),
    entities: [`${serviceBasePath}/**/*.entity{.js,.ts}`],
    migrations: [`${serviceBasePath}/**/migrations/*{.js,.ts}`],
    cli: {
      entitiesDir: 'src/api/entities',
      migrationsDir: 'src/db/migrations',
      subscribersDir: 'src/db/subscribers'
    }
  };
};
