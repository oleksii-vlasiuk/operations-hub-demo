import axios from "axios";
import type { User } from "./User";

const API_URL = "http://localhost:8081/api/users";

export const getUsers = () =>
  axios.get<User[]>(API_URL);

export const createUser = (user: Omit<User, "id">) =>
  axios.post<User>(API_URL, user);

export const deleteUser = (id: number) =>
  axios.delete<void>(`${API_URL}/${id}`);
