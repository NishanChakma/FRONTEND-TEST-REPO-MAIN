"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "AUDITOR" | "COMPLIANCE_OFFICER" | "FUND_MANAGER";
  status?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // ensure client only

    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const { data } = await api.get("/auth/profile");
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false); // <-- always runs even if error or timeout
      }
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    const { data } = await api.get("/auth/profile");
    setUser(data);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
