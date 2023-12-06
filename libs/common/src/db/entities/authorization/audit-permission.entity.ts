import { Dayjs } from 'dayjs';

import { AuditDataChangeType } from '../../../misc/api.types';
import { Permission } from './permission.entity';

export class AuditPermission {
  id: string;
  permissionId: string;
  changeType: AuditDataChangeType;
  changeByUserId: string;
  originalData: Permission;
  newData: Permission;
  createdAt: Dayjs;
}
