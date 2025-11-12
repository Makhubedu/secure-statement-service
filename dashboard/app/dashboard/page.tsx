export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-capitec-navy">Dashboard</h1>
        <p className="text-lg mt-2 text-neutral-400">
          Welcome to the Secure Statement Service dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card-capitec-stat card-capitec-stat-blue">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Total Statements</h3>
            <div className="icon-bg-blue">
              <svg className="h-8 w-8 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-5xl font-bold text-capitec-navy">0</p>
          <p className="mt-3 text-sm font-medium text-neutral-400">All time</p>
        </div>
        
        <div className="card-capitec-stat card-capitec-stat-green">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Downloaded</h3>
            <div className="icon-bg-green">
              <svg className="h-8 w-8 text-capitec-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-5xl font-bold text-capitec-navy">0</p>
          <p className="mt-3 text-sm font-medium text-neutral-400">Successful downloads</p>
        </div>
        
        <div className="card-capitec-stat card-capitec-stat-red">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-400">Pending</h3>
            <div className="icon-bg-red">
              <svg className="h-8 w-8 text-capitec-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-5xl font-bold text-capitec-navy">0</p>
          <p className="mt-3 text-sm font-medium text-neutral-400">Awaiting download</p>
        </div>
      </div>
    </div>
  );
}
