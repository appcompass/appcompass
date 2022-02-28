import { Injectable, PipeTransform } from '@nestjs/common';

import { DBNamingStrategy } from '../../db/naming.strategy';

@Injectable()
export class QueryOrderPipe implements PipeTransform {
  transform(value: string): Record<string, 'ASC' | 'DESC'> {
    if (!value) return {};
    return value
      .split(',')
      .map((row) => row.split(':'))
      .reduce(
        (o, [k, v]) => ((o[new DBNamingStrategy().columnName(k.trim())] = (v || 'asc').trim().toUpperCase()), o),
        {}
      );
  }
}
