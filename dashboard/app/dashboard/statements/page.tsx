"use client";

export default function StatementsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-capitec-navy">Statements</h1>
          <p className="text-lg mt-2 text-neutral-400">
            Manage and view all financial statements
          </p>
        </div>
        <button className="btn-capitec-primary hover-lift">
          + Upload Statement
        </button>
      </div>

      <div className="card-capitec p-12">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-bg-blue mb-6">
            <svg className="h-20 w-20 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-capitec-navy">No statements yet</h3>
          <p className="text-base max-w-md text-neutral-400">
            Upload your first statement to get started with secure document distribution.
          </p>
        </div>
      </div>
    </div>
  );
}
