import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePermissionPayload {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly label: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsUUID(4)
  @IsOptional()
  readonly assignableById: string;
}
