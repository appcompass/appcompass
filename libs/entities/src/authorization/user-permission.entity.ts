import { IsUUID } from 'class-validator';

import { Permission } from './permission.entity';

export class UserPermission {
  constructor(partial: Partial<UserPermission>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  userId: string;

  @IsUUID(4)
  permissionId: string;

  permission!: Permission;
}
