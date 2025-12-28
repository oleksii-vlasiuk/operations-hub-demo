// src/api.ts
import axios from "axios";
import type { User, CreateUserRequest, UserStatus } from "./User";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getUsers = (status?: UserStatus) => {
  return api.get<User[]>("/users", {
    params: status ? { status } : {},
  });
};

export const createUser = (payload: CreateUserRequest) => {
  return api.post<User>("/users", payload);
};

export const disableUser = (id: number) => {
  return api.delete<void>(`/users/${id}`);
};

export const enableUser = (id: number) => {
  return api.patch<void>(`/users/${id}/enable`);
};
