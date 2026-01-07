import axios from "axios";
import type { CreateUserRequest, User, UserStatus } from "./User";

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
