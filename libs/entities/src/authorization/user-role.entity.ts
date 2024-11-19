import { IsUUID } from 'class-validator';

import { Role } from './role.entity';

export class UserRole {
  constructor(partial: Partial<UserRole>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  userId: string;

  @IsUUID(4)
  roleId: string;

  role!: Role;
}
