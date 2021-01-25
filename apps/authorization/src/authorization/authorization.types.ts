export type DecodedToken = {
  email: string;
  sub: number;
  iat: number;
  exp: number;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  password: string;
  active: boolean;
  permissions: string[];
  activationCode: string;
  activatedAt: string;
  lastLogin: string;
  tokenExpiration: string;
  createdAt: string;
  updatedAt: string;
};

export enum AuditAuthAssignmentType {
  assigned = 'ASSIGNED',
  revoked = 'REVOKED'
}

export enum AuditDataChangeType {
  created = 'CREATED',
  updated = 'UPDATED',
  deleted = 'DELETED'
}
