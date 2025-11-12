"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="spinner-capitec mx-auto"></div>
          <p className="mt-4 text-base font-medium text-capitec-navy">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md bg-gradient-capitec-header">
        <div className="mx-auto max-w-7xl flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-capitec-blue">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="hidden sm:block text-xl font-bold text-white whitespace-nowrap">Secure Statements</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-white/90 transition-all hover:text-white hover:scale-105 whitespace-nowrap"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/statements"
                className="text-sm font-semibold text-white/90 transition-all hover:text-white hover:scale-105 whitespace-nowrap"
              >
                Statements
              </Link>
              <Link
                href="/dashboard/download-logs"
                className="text-sm font-semibold text-white/90 transition-all hover:text-white hover:scale-105 whitespace-nowrap"
              >
                Download Logs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="hidden sm:block text-sm text-white/95 font-medium truncate max-w-[200px]">
              {user?.email}
            </span>
            <button
              onClick={() => logout()}
              className="px-6 py-2.5 rounded-lg font-bold transition-all shadow-md text-sm whitespace-nowrap bg-capitec-blue text-white hover:bg-white hover:text-capitec-navy hover-lift"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
