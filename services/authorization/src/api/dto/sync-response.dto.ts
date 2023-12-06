import { IsUUID } from 'class-validator';

export class SyncResponse {
  /**
   * The list of IDs for removed associations
   */
  @IsUUID(4, { each: true })
  readonly removed: string[];

  /**
   * The list of IDs for added associations
   */
  @IsUUID(4, { each: true })
  readonly added: string[];

  /**
   * The list of IDs for unchanged associations
   */
  @IsUUID(4, { each: true })
  readonly unchanged: string[];
}
