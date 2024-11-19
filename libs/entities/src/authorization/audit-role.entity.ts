import { Transform, Type } from 'class-transformer';
import { IsEnum, IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { AuditDataChangeType } from '../misc/enums';
import { Role } from './role.entity';

export class AuditRole {
  @IsUUID(4)
  id: string;

  @IsUUID(4)
  roleId: string;

  @IsEnum(AuditDataChangeType)
  changeType: AuditDataChangeType;

  @IsUUID(4)
  changeByUserId: string;

  originalData: Role;

  newData: Role;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  createdAt: Dayjs;
}
