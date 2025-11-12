export default function DownloadLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Download Logs</h1>
        <p className="text-muted-foreground">
          View all statement download history and audit trail
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <p className="text-center text-muted-foreground">
            No download logs found.
          </p>
        </div>
      </div>
    </div>
  );
}
