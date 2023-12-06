import { Dayjs } from 'dayjs';

import { AuditDataChangeType } from '../../../misc/api.types';
import { Role } from './role.entity';

export class AuditRole {
  id: string;
  roleId: string;
  changeType: AuditDataChangeType;
  changeByUserId: string;
  originalData: Role;
  newData: Role;
  createdAt: Dayjs;
}
