import { ValidateNested } from 'class-validator';

export class EventPayload<T> {
  @ValidateNested()
  readonly data: T;
}
