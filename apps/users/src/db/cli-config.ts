import { ConfigService } from '@nestjs/config';

import { DBNamingStrategy } from './naming.strategy';

const configService = new ConfigService();

export = {
  logging: 'all',
  ...JSON.parse(configService.get('DB_CONFIG')),
  schema: 'users',
  namingStrategy: new DBNamingStrategy(),
  entities: [`${__dirname}/../**/*.entity{.js,.ts}`],
  migrations: [`${__dirname}/migrations/*{.js,.ts}`],
  cli: {
    entitiesDir: 'src/db/entities',
    migrationsDir: 'src/db/migrations',
    subscribersDir: 'src/db/subscribers'
  }
};
