"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    return () => {
      setMobileMenuOpen(false);
    };
  }, [pathname]);

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

  const navLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/statements", label: "Statements" },
    { href: "/dashboard/download-logs", label: "Download Logs" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md bg-gradient-capitec-header">
        <div className="mx-auto max-w-7xl flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4 md:gap-10 flex-1 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-capitec-blue">
                <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="hidden sm:block text-base md:text-xl font-bold text-white whitespace-nowrap">
                Secure Statements
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-all hover:text-white whitespace-nowrap ${
                    pathname === link.href ? "text-white" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <span className="hidden md:block text-xs md:text-sm text-white/95 font-medium truncate max-w-[120px] lg:max-w-[200px]">
              {user?.email}
            </span>
            <button
              onClick={() => logout()}
              className="hidden sm:block px-3 md:px-6 py-2 md:py-2.5 rounded-lg font-bold transition-all shadow-md text-xs md:text-sm whitespace-nowrap bg-capitec-blue text-white hover:bg-white hover:text-capitec-navy hover-lift"
            >
              Logout
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-capitec-navy border-t border-white/10">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    pathname === link.href
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="px-3 py-2 text-xs text-white/70 truncate">
                  {user?.email}
                </div>
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 md:py-8">{children}</div>
      </main>
    </div>
  );
}
