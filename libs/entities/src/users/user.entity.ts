import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, IsUUID } from 'class-validator';
import dayjs, { Dayjs } from 'dayjs';

import { PasswordReset } from './password-reset.entity';
import { UserLogin } from './user-login.entity';

export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @IsUUID(4)
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  activationCode: string;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  activatedAt: Dayjs;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  lastLogin: Dayjs;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  lastLogout: Dayjs;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  createdAt: Dayjs;

  @Type(() => Date)
  @Transform(({ value }) => (value ? dayjs(value) : null))
  updatedAt: Dayjs;

  logins: UserLogin[];

  passwordResets: PasswordReset[];
}
