// src/modules/users/types.ts (если у тебя иначе — адаптируй)
export type UserStatus = "ACTIVE" | "DISABLED";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  role?: string;
  createdAt?: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export type AuditEvent = {
  id: number;
  occurredAt: string;      // ISO string
  actorUserId: number | null;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata: string;        // JSON string (пока)
};

// Spring Page<T>
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;          // current page (0-based)
  first: boolean;
  last: boolean;
};
