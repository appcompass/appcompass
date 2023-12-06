import { Dayjs } from 'dayjs';

import { AuditAuthAssignmentType } from '../../../misc/api.types';

export class AuditUserRole {
  id: string;
  userId: string;
  roleId: string;
  changeType: AuditAuthAssignmentType;
  changeByUserId: string;
  createdAt: Dayjs;
}
