import { camelCase, mapKeys, snakeCase } from 'lodash';
import { ValueTransformer } from 'typeorm';

export class EntityTransformer implements ValueTransformer {
  to(value: Record<string, unknown>): Record<string, unknown> {
    return mapKeys(value, (v: unknown, k: string) => snakeCase(k));
  }

  from(value: Record<string, unknown>): Record<string, unknown> {
    return mapKeys(value, (v: unknown, k: string) => camelCase(k));
  }
}
