import { Entity } from 'typeorm';

import { Role } from './role.entity';
import { UserPermission } from './user-permission.entity';

@Entity('permissions')
export class Permission {
  id: string;
  name: string;
  label: string;
  description: string;
  system: boolean;
  assignableBy: Permission;
  roles: Role[];
  assignablePermissions: Permission[];
  assignableRoles: Role[];
  permissionToUsers: UserPermission[];
}
