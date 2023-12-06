import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserIdPayload {
  @IsUUID(4)
  @IsNotEmpty()
  readonly userId: string;
}
