import { IsOptional, IsString, IsUUID } from 'class-validator';

import { PermissionExists } from '../validators/permission-exists.validator';

export class UpdatePermissionPayload {
  @PermissionExists(false)
  @IsString()
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
}
