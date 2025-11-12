"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";
import { getApiUrl } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  // If already authenticated (mounted navigation), push to dashboard
  useEffect(() => {
    (async () => {
      try {
        if (await Session.doesSessionExist()) {
          // optional backend confirmation; ignore errors
          try { await fetch(getApiUrl("/auth/me"), { credentials: "include" }); } catch {}
          router.replace("/dashboard");
        }
      } catch {}
    })();
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function waitForSessionStable(maxMs = 3000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      try {
        if (await Session.doesSessionExist()) {
          // Double-check backend recognises session (guards rely on this)
          const meResp = await fetch(getApiUrl("/auth/me"), {
            credentials: "include",
          });
          if (meResp.ok) {
            const json = await meResp.json();
            if (json && json.success) return true;
          }
        }
      } catch (err) {
        // swallow and retry until timeout
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    return false;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signIn({
        formFields: [
          { id: "email", value: email },
          { id: "password", value: password },
        ],
      });

      if (response.status === "OK") {
        const stable = await waitForSessionStable();
        if (stable) {
          router.replace("/dashboard");
        } else {
          setError(
            "Session could not be established. Please retry signing in."
          );
          setIsLoading(false);
        }
      } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (response.status === "FIELD_ERROR") {
        const errors = response.formFields
          .map((field) => field.error)
          .filter(Boolean)
          .join(", ");
        setError(errors || "Invalid input");
        setIsLoading(false);
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-capitec p-4">
      <div className="w-full max-w-md space-y-6 card-capitec p-6 md:p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-gradient-capitec-header">
              <svg className="h-8 w-8 md:h-10 md:w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-capitec-navy">Secure Statement Service</h1>
          <p className="mt-2 text-sm md:text-base text-neutral-400">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 md:space-y-5">
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
