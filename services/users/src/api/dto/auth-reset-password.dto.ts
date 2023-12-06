import { IsNotEmpty, IsString } from 'class-validator';

import { IsSameAs } from '@appcompass/common';

import { ResetPasswordCodeNotUsed } from '../validators/reset-password-code-not-used';

export class ResetPasswordDto {
  @IsString()
  @ResetPasswordCodeNotUsed()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @IsSameAs('password')
  readonly passwordConfirm: string;
}
