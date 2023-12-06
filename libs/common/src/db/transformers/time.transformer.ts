import dayjs, { Dayjs } from 'dayjs';
import { ValueTransformer } from 'typeorm';

export class TimeTransformer implements ValueTransformer {
  to(value: Dayjs): Date {
    if (value instanceof dayjs) return value.toDate();
    if (typeof value === 'string') return new Date(value);
  }

  from(value: Date): Dayjs {
    if (value instanceof Date) return dayjs(value);
  }
}
