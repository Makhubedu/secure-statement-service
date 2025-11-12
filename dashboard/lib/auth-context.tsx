"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  userId: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const frontToken = sessionStorage.getItem("front-token");
      const accessToken = sessionStorage.getItem("st-access-token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (frontToken) {
        headers["front-token"] = frontToken;
      }
      if (accessToken) {
        headers["st-access-token"] = accessToken;
      }

      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser({
            userId: data.userId,
            email: data.email,
            roles: data.roles,
          });
        } else {
          setUser(null);
          sessionStorage.removeItem("front-token");
          sessionStorage.removeItem("st-access-token");
          sessionStorage.removeItem("st-refresh-token");
        }
      } else {
        setUser(null);
        sessionStorage.removeItem("front-token");
        sessionStorage.removeItem("st-access-token");
        sessionStorage.removeItem("st-refresh-token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const frontToken = sessionStorage.getItem("front-token");
      const accessToken = sessionStorage.getItem("st-access-token");

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (frontToken) {
        headers["front-token"] = frontToken;
      }
      if (accessToken) {
        headers["st-access-token"] = accessToken;
      }

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers,
      });

      sessionStorage.removeItem("front-token");
      sessionStorage.removeItem("st-access-token");
      sessionStorage.removeItem("st-refresh-token");

      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
