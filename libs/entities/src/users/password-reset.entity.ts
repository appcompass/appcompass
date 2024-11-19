import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { User } from './user.entity';

export class PasswordReset {
  constructor(partial: Partial<PasswordReset>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  id: string;

  @IsUUID(4)
  userId: string;

  @IsString()
  code: string;

  @IsBoolean()
  used: boolean;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  createdAt: Dayjs;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  updatedAt: Dayjs;

  user: User;
}
