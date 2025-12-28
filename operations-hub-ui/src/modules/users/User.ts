export type UserStatus = "ACTIVE" | "DISABLED";

export type Role = "ADMIN" | "MANAGER" | "USER";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  role: Role;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}