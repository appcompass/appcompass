import * as Joi from 'joi';

import { ConsoleLogger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLogsController } from './api/controllers/audit-logs.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
import { PermissionsController } from './api/controllers/permissions.controller';
import { RolesController } from './api/controllers/roles.controller';
import { UserAuthorizationController } from './api/controllers/user-authorization.controller';
import { AuditPermission } from './api/entities/audit-permission.entity';
import { AuditRolePermission } from './api/entities/audit-role-permission.entity';
import { AuditRole } from './api/entities/audit-role.entity';
import { AuditUserPermission } from './api/entities/audit-user-permission.entity';
import { AuditUserRole } from './api/entities/audit-user-role.entity';
import { Permission } from './api/entities/permission.entity';
import { Role } from './api/entities/role.entity';
import { UserPermission } from './api/entities/user-permission.entity';
import { UserRole } from './api/entities/user-role.entity';
import { AuditLogsService } from './api/services/audit-logs.service';
import { PermissionsService } from './api/services/permissions.service';
import { RolesService } from './api/services/roles.service';
import { UserAuthorizationService } from './api/services/user-authorization.service';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { OrderQueryValidator } from './api/validators/order-query-string.validator';
import { PermissionExistsValidator } from './api/validators/permission-exists.validator';
import { PermissionsExistValidator } from './api/validators/permissions-exist.validator';
import { RoleExistsValidator } from './api/validators/role-exists.validator';
import { RolesExistValidator } from './api/validators/roles-exist.validator';
import { SameAsValidator } from './api/validators/same-as.validator';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// TODO: move to @appcompass/db
import { DBNamingStrategy } from './db/naming.strategy';
// TODO: move to @appcompass/messaging
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
        schema: 'auth',
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
    TypeOrmModule.forFeature([
      AuditPermission,
      AuditRolePermission,
      AuditRole,
      AuditUserPermission,
      AuditUserRole,
      Permission,
      Role,
      UserPermission,
      UserRole
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [
    AppController,
    PermissionsController,
    RolesController,
    UserAuthorizationController,
    AuditLogsController,
    InterServiceController
  ],
  providers: [
    AppService,
    ConfigService,
    ConsoleLogger,
    JwtStrategy,
    PermissionsService,
    MessagingService,
    RolesService,
    PermissionsService,
    UserAuthorizationService,
    AuditLogsService,
    SameAsValidator,
    PermissionExistsValidator,
    PermissionsExistValidator,
    RoleExistsValidator,
    RolesExistValidator,
    OrderQueryValidator
  ]
})
export class AppModule {}
