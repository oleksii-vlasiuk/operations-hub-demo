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
