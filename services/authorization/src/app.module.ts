import * as Joi from 'joi';

import {
  extendedJoi,
  LogInterserviceRequestsMiddleware,
  registerBaseModuleImports,
  registerBaseModuleProviders
} from '@appcompass/common';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuditLogsController } from './api/controllers/audit-logs.controller';
import { InterServiceController } from './api/controllers/inter-service.controller';
import { MyAuthorizationController } from './api/controllers/my-authorization.controller';
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
import { PermissionExistsValidator } from './api/validators/permission-exists.validator';
import { PermissionsExistValidator } from './api/validators/permissions-exist.validator';
import { RoleExistsValidator } from './api/validators/role-exists.validator';
import { RolesExistValidator } from './api/validators/roles-exist.validator';
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
    ...registerBaseModuleImports(__dirname, [
      AuditPermission,
      AuditRolePermission,
      AuditRole,
      AuditUserPermission,
      AuditUserRole,
      Permission,
      Role,
      UserPermission,
      UserRole
    ])
  ],
  controllers: [
    AppController,
    PermissionsController,
    RolesController,
    UserAuthorizationController,
    MyAuthorizationController,
    AuditLogsController,
    InterServiceController
  ],
  providers: [
    ...registerBaseModuleProviders(),
    AuditLogsService,
    PermissionExistsValidator,
    PermissionsExistValidator,
    PermissionsService,
    RoleExistsValidator,
    RolesExistValidator,
    RolesService,
    UserAuthorizationService
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogInterserviceRequestsMiddleware).forRoutes(InterServiceController);
  }
}
