import axios from "axios";
import type { CreateUserRequest, User, UserStatus } from "./User";
import type { AuditEvent, Page } from "./types";
import { api } from "../../core/api/axios";

const client = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getUsers = (status?: UserStatus) =>
  client.get<User[]>("/users", {
    params: status ? { status } : {},
  });

export const createUser = (request: CreateUserRequest) =>
  client.post<User>("/users", request);

export const disableUser = (id: number) =>
  client.patch<void>(`/users/${id}/disable`);

export const enableUser = (id: number) =>
  client.patch<void>(`/users/${id}/enable`);

export type AuditQuery = {
  entityType?: string;      // e.g. "USER"
  entityId?: string;        // e.g. "4"
  action?: string;          // e.g. "USER_DISABLED"
  actorUserId?: number;
  page?: number;            // 0-based
  size?: number;            // 1..100
};

export function getAudit(query: AuditQuery) {
  return api.get<Page<AuditEvent>>("/audit", { params: query });
}
