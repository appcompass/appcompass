import { Dayjs } from 'dayjs';

import { AuditAuthAssignmentType } from '../../../misc/api.types';

export class AuditUserPermission {
  id: string;
  userId: number;
  permissionId: string;
  changeType: AuditAuthAssignmentType;
  changeByUserId: string;
  createdAt: Dayjs;
}
