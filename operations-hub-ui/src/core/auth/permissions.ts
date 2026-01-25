export type Role = "ADMIN" | "MANAGER" | "USER";

export const canManageUsers = (role?: Role) => role === "ADMIN";
export const canCreateTasks = (role?: Role) => role === "ADMIN" || role === "MANAGER";
export const canAssignTasks = (role?: Role) => role === "ADMIN" || role === "MANAGER";