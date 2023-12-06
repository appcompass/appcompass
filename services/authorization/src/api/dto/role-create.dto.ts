import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { RoleExists } from '../validators/role-exists.validator';

export class CreateRolePayload {
  @RoleExists(false)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsUUID(4)
  @IsOptional()
  readonly assignableById: string;
}
