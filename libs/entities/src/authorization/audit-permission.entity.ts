import { Transform, Type } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { AuditDataChangeType } from '../misc/enums';
import { Permission } from './permission.entity';

export class AuditPermission {
  @IsUUID(4)
  id: string;

  @IsUUID(4)
  permissionId: string;

  @IsEnum(AuditDataChangeType)
  changeType: AuditDataChangeType;

  @IsUUID(4)
  changeByUserId: string;

  originalData: Permission;

  newData: Permission;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  createdAt: Dayjs;
}
