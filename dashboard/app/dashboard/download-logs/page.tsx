export default function DownloadLogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-capitec-navy">Download Logs</h1>
        <p className="text-lg mt-2 text-neutral-400">
          View all statement download history and audit trail
        </p>
      </div>

      <div className="card-capitec p-12">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-bg-blue mb-6">
            <svg className="h-20 w-20 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-capitec-navy">No download logs yet</h3>
          <p className="text-base max-w-md text-neutral-400">
            Download activity will appear here once statements are accessed.
          </p>
        </div>
      </div>
    </div>
  );
}
