import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-capitec p-4">
      <main className="flex flex-col items-center gap-6 md:gap-8 px-4 md:px-8 text-center text-white max-w-4xl">
        <div className="flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm shadow-xl">
          <svg className="h-10 w-10 md:h-14 md:w-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg">
          Secure Statement Service
        </h1>
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/95 font-medium">
          Manage and securely distribute financial statements with encryption and audit logging.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 md:mt-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto">
            <button className="btn-capitec-primary hover-lift w-full">
              Sign In
            </button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="btn-capitec-secondary hover-lift w-full">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
