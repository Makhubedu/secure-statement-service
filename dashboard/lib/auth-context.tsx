"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";
import { getApiUrl } from "./config";
import type { User } from "@/types";

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
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const session = useSessionContext();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setAuthLoading(true);
    if (session.loading) return;

    const doesSessionExist =
      !session.loading && session.accessTokenPayload !== undefined;

    if (!doesSessionExist) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/auth/me"), {
        credentials: "include",
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
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, [session.loading]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (session.loading) return;
    checkAuth();
  }, [session.loading, checkAuth]);

  const doesSessionExist =
    !session.loading && session.accessTokenPayload !== undefined;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: session.loading || authLoading,
        isAuthenticated: !!user && doesSessionExist,
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
