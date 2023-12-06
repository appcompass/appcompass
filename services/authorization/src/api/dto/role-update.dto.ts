import { IsOptional, IsString, IsUUID } from 'class-validator';

import { PermissionsExist } from '../validators/permissions-exist.validator';
import { RoleExists } from '../validators/role-exists.validator';

export class UpdateRolePayload {
  @RoleExists(false)
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly label: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsUUID(4)
  @IsOptional()
  readonly assignableById: string;

  @IsUUID(4, { each: true })
  @IsOptional()
  @PermissionsExist()
  readonly permissionIds: string[];
}
