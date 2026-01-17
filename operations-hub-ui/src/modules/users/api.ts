import axios from "axios";
import type { CreateUserRequest, User, UserStatus } from "./User";
import type { AuditEvent } from "./types";
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


export type AuditPageResponse = {
  content: AuditEvent[];
  totalElements: number;
  number: number; // текущая страница
  size: number;
};

export type AuditQuery = {
  entityType?: string;
  entityId?: string;
  action?: string;
  actorUserId?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
};

export function getAuditEvents(params: AuditQuery) {
  return api.get<AuditPageResponse>("/audit", { params });
}