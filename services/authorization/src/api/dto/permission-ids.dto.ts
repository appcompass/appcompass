import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

import { PermissionsExist } from '../validators/permissions-exist.validator';

export class PermissionIdsPayload {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID(4, { each: true })
  @PermissionsExist()
  readonly permissionIds: string[];
}
