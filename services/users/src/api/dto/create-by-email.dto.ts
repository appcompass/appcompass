import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CreateByEmailDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;
}
