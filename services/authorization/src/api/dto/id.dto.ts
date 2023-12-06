import { IsUUID } from 'class-validator';

export class IdResponse {
  @IsUUID(4)
  id: string;
}
