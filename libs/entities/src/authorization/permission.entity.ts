import { IsBoolean, IsString, IsUUID } from 'class-validator';

import { Role } from './role.entity';
import { UserPermission } from './user-permission.entity';

export class Permission {
  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  id: string;

  @IsString()
  name: string;

  @IsString()
  label: string;

  @IsString()
  description: string;

  @IsBoolean()
  system: boolean;

  assignableBy: Permission;

  roles: Role[];

  assignablePermissions: Permission[];

  assignableRoles: Role[];

  permissionToUsers: UserPermission[];
}
