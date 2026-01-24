import { createContext, useContext } from "react";
import type { User } from "../../modules/users/types";

type AuthState = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export const AuthProvider = AuthContext.Provider;
export const useAuth = () => useContext(AuthContext);
