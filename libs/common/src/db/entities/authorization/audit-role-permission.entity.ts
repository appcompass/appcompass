import { Dayjs } from 'dayjs';

import { AuditAuthAssignmentType } from '../../../misc/api.types';

export class AuditRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  changeType: AuditAuthAssignmentType;
  changeByUserId: string;
  createdAt: Dayjs;
}
