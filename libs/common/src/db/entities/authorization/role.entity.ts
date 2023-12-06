import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';

export class Role {
  id: string;
  name: string;
  label: string;
  description: string;
  system: boolean;
  assignableBy: Permission;
  roleToUsers: UserRole[];
  permissions: Permission[];
}
