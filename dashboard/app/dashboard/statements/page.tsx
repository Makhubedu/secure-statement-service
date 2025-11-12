export default function StatementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statements</h1>
          <p className="text-muted-foreground">
            Manage and view all financial statements
          </p>
        </div>
        <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
          Upload Statement
        </button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <p className="text-center text-muted-foreground">
            No statements found. Upload your first statement to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
