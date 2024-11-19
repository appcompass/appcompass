import { Transform, Type } from 'class-transformer';
import { IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { User } from './user.entity';

export class UserLogin {
  constructor(partial: Partial<UserLogin>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  id: string;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  loginAt: Dayjs;

  user: User;
}
