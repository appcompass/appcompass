import { Permission } from './permission.entity';

export class UserPermission {
  userId: string;
  permissionId: string;
  permission!: Permission;
}
