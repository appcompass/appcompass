import { Request } from 'express';
import { OrderByCondition } from 'typeorm';

import { TokenUser } from '../dtos';

export interface AuthenticatedRequest extends Request {
  user: TokenUser;
}

export enum AuditDataChangeType {
  created = 'CREATED',
  updated = 'UPDATED',
  deleted = 'DELETED'
}

export enum AuditAssignmentType {
  added = 'ADDED',
  updated = 'UPDATED',
  removed = 'REMOVED'
}

export enum AuditAuthAssignmentType {
  assigned = 'ASSIGNED',
  revoked = 'REVOKED'
}

export type OrderQuery<T> = { [P in keyof T]?: 'ASC' | 'DESC' };

export interface FilterAllQuery<T> {
  order: OrderByCondition;
  take: number;
  skip: number;
  filter?: string;
  where?: Partial<T>;
}

export interface ResultsAndTotal<T> {
  data: Array<T>;
  total: number;
}

export interface User {
  id: number;
  email: string;
  active: boolean;
}

export interface IPCResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export interface InterserviceCallResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
