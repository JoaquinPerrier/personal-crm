"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, type AuthUser, ApiClientError } from "@/lib/api-client";
import type { UpdateUserProfileInput } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, redirect?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (data: UpdateUserProfileInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const { user } = await api.me();
      setUser(user);
    } catch (err) {
      setUser(null);
      if (err instanceof ApiClientError && err.status === 401) {
        await api.logout().catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = async (email: string, password: string, redirect = "/dashboard") => {
    const { user } = await api.login(email, password);
    setUser(user);
    router.push(redirect);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user } = await api.register(name, email, password);
    setUser(user);
    router.push("/dashboard");
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    router.push("/login");
  };

  const updateProfile = useCallback(async (data: UpdateUserProfileInput) => {
    const { user } = await api.updateProfile(data);
    setUser(user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refresh, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiClientError };
