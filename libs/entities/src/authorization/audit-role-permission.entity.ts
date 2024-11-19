import { Transform, Type } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { AuditAuthAssignmentType } from '../misc/enums';

export class AuditRolePermission {
  @IsUUID(4)
  id: string;

  @IsUUID(4)
  roleId: string;

  @IsUUID(4)
  permissionId: string;

  @IsEnum(AuditAuthAssignmentType)
  changeType: AuditAuthAssignmentType;

  @IsUUID(4)
  changeByUserId: string;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  createdAt: Dayjs;
}
