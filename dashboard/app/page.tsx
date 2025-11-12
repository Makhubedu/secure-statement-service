import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-capitec">
      <main className="flex flex-col items-center gap-8 px-8 text-center text-white">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm shadow-xl">
          <svg className="h-14 w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold tracking-tight drop-shadow-lg">
          Secure Statement Service
        </h1>
        <p className="max-w-2xl text-xl text-white/95 font-medium">
          Manage and securely distribute financial statements with encryption and audit logging.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/login">
            <button className="btn-capitec-primary hover-lift">
              Sign In
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="btn-capitec-secondary hover-lift">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
