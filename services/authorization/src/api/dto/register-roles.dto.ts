import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { CreatePermissionPayload } from './permission-create.dto';

export class RegisterRolesPayload {
  @ValidateNested()
  @Type(() => RegisterRoles)
  readonly data: RegisterRoles[];
}
export class RegisterRoles {
  @IsString()
  @IsNotEmpty()
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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePermissionPayload)
  readonly permissions: CreatePermissionPayload[];
}
