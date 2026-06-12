import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: null,
  isGuest: true,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
