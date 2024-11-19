import { IsBoolean, IsString, IsUUID } from 'class-validator';

import { Permission } from './permission.entity';
import { UserRole } from './user-role.entity';

export class Role {
  constructor(partial: Partial<Role>) {
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

  roleToUsers: UserRole[];

  permissions: Permission[];
}
