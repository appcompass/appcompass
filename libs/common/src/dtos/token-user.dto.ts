import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString, ValidateIf, validateOrReject } from 'class-validator';
import { Dayjs } from 'dayjs';

export class TokenUser {
  constructor(partial: Partial<TokenUser>) {
    Object.assign(this, partial);
    validateOrReject(this).catch((errors) => {
      throw new Error(errors.toString());
    });
  }

  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  @Exclude()
  password: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  activationCode: string;

  @Transform(({ value }) => value?.format() || null)
  @IsString()
  @ValidateIf((object, value) => value !== null)
  activatedAt: Dayjs;

  @Transform(({ value }) => value?.format() || null)
  @IsString()
  @ValidateIf((object, value) => value !== null)
  lastLogin: Dayjs;

  @Transform(({ value }) => value?.format() || null)
  @IsString()
  lastLogout: Dayjs;

  @Transform(({ value }) => value?.format() || null)
  @IsString()
  createdAt: Dayjs;

  @Transform(({ value }) => value?.format() || null)
  @IsString()
  updatedAt: Dayjs;
}
