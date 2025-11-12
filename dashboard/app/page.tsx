import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 px-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Secure Statement Service
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Manage and securely distribute financial statements with encryption and audit logging.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-8 py-3 text-base font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
