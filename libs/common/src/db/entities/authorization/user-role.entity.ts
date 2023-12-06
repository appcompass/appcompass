import { Role } from './role.entity';

export class UserRole {
  userId: string;
  roleId: string;
  role!: Role;
}
