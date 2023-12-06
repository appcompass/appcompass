import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

import { RolesExist } from '../validators/roles-exist.validator';

export class SyncUserRolesPayload {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID(4, { each: true })
  @RolesExist()
  readonly roleIds: string[];
}
