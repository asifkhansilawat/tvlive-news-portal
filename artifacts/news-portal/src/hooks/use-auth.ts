import { create } from "zustand";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => {
  const token = localStorage.getItem("admin_token");
  
  return {
    token,
    isAuthenticated: !!token,
    login: (token: string) => {
      localStorage.setItem("admin_token", token);
      set({ token, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem("admin_token");
      set({ token: null, isAuthenticated: false });
    },
  };
});
