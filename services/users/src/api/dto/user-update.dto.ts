import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { Dayjs } from 'dayjs';

import { IsEmailUsed } from '../validators/unique-email.validator';

export class UpdateUserPublicDto {
  @IsEmail()
  @IsEmailUsed(true)
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly password: string;
}

export class UpdateUserPrivateDto {
  @IsUUID(4)
  readonly id: string;

  @IsEmail()
  @IsEmailUsed(true)
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly lastLogin: Dayjs;

  @IsString()
  @IsOptional()
  readonly lastLogout: Dayjs;
}
