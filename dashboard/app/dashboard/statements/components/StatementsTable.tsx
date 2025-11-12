import { StatusBadge } from "./StatusBadge";
import type { Statement } from "../types";

type StatementsTableProps = {
  statements: Statement[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  onGenerateLink: (statement: Statement) => void;
};

export function StatementsTable({
  statements,
  loading,
  error,
  onRefresh,
  onGenerateLink,
}: StatementsTableProps) {
  if (loading) {
    return (
      <div className="card-capitec p-6">
        <div className="py-12 text-center text-neutral-400">Loading statements…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-capitec p-6">
        <div className="alert-capitec-error">{error}</div>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="card-capitec p-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="icon-bg-blue mb-6">
            <svg
              className="h-20 w-20 text-capitec-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2 text-capitec-navy">No statements yet</h3>
          <p className="text-base max-w-md text-neutral-400">
            Upload your first statement to get started with secure document distribution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-capitec p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-capitec-navy">Your Statements</h2>
        <button onClick={onRefresh} className="text-sm text-capitec-blue hover:underline">
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="py-3">Period</th>
              <th className="py-3">Uploaded</th>
              <th className="py-3">File</th>
              <th className="py-3">Size</th>
              <th className="py-3">Status</th>
              <th className="py-3">Downloads</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((statement) => (
              <tr key={statement.id} className="border-t border-neutral-100">
                <td className="py-3 font-medium">{statement.statementPeriod}</td>
                <td className="py-3">{new Date(statement.createdAt).toLocaleString()}</td>
                <td className="py-3">{statement.originalFileName}</td>
                <td className="py-3">{statement.fileSizeMB} MB</td>
                <td className="py-3">
                  <StatusBadge
                    isExpired={statement.isExpired}
                    isDownloadable={statement.isDownloadable}
                    status={statement.status}
                  />
                </td>
                <td className="py-3">{statement.downloadCount}</td>
                <td className="py-3 text-right">
                  {statement.isDownloadable ? (
                    <button
                      onClick={() => onGenerateLink(statement)}
                      className="px-4 py-2 rounded-lg font-semibold transition-all text-sm border-2"
                      style={{
                        borderColor: "var(--capitec-blue)",
                        color: "var(--capitec-blue)",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--capitec-blue)";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--capitec-blue)";
                      }}
                    >
                      Get download link
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-400">Not available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
