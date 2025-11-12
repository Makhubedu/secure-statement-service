"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      if (data.success) {
        const frontToken = response.headers.get("front-token");
        const accessToken = response.headers.get("st-access-token");
        const refreshToken = response.headers.get("st-refresh-token");

        if (frontToken) {
          sessionStorage.setItem("front-token", frontToken);
        }
        if (accessToken) {
          sessionStorage.setItem("st-access-token", accessToken);
        }
        if (refreshToken) {
          sessionStorage.setItem("st-refresh-token", refreshToken);
        }

        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-capitec">
      <div className="w-full max-w-md space-y-6 card-capitec p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-capitec-header">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-capitec-navy">Secure Statement Service</h1>
          <p className="mt-2 text-base text-neutral-400">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && (
            <div className="alert-capitec-error">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label-capitec">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="input-capitec"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-capitec">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-capitec"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-capitec-primary w-full"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-sm">
            <Link
              href="/"
              className="font-semibold transition-colors inline-flex items-center gap-1 text-capitec-blue hover:text-capitec-dark-blue"
            >
              <span>←</span> Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
