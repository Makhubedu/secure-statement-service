import { StatusBadge } from "./StatusBadge";
import { formatDateShort } from "@/lib/format-utils";
import type { Statement } from "@/types";

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
      <div className="card-capitec p-4 md:p-6">
        <div className="py-12 text-center text-neutral-400">Loading statements…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-capitec p-4 md:p-6">
        <div className="alert-capitec-error">{error}</div>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="card-capitec p-4 md:p-6">
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
          <div className="icon-bg-blue mb-4 md:mb-6">
            <svg
              className="h-12 w-12 md:h-20 md:w-20 text-capitec-blue"
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
          <h3 className="text-lg md:text-xl font-bold mb-2 text-capitec-navy">No statements yet</h3>
          <p className="text-sm md:text-base max-w-md text-neutral-400">
            Upload your first statement to get started with secure document distribution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-capitec p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-capitec-navy">Your Statements</h2>
        <button onClick={onRefresh} className="text-xs md:text-sm text-capitec-blue hover:underline font-semibold">
          Refresh
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400 text-xs uppercase tracking-wider">
              <th className="py-3 font-semibold">Period</th>
              <th className="py-3 font-semibold">Uploaded</th>
              <th className="py-3 font-semibold">File</th>
              <th className="py-3 font-semibold">Size</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Downloads</th>
              <th className="py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((statement) => (
              <tr key={statement.id} className="border-t border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="py-4 font-medium text-capitec-navy">{statement.statementPeriod}</td>
                <td className="py-4 text-neutral-600">
                  {formatDateShort(statement.createdAt)}
                </td>
                <td className="py-4 text-neutral-600 max-w-xs truncate" title={statement.originalFileName}>
                  {statement.originalFileName}
                </td>
                <td className="py-4 text-neutral-600">{statement.fileSizeMB} MB</td>
                <td className="py-4">
                  <StatusBadge
                    isExpired={statement.isExpired}
                    isDownloadable={statement.isDownloadable}
                    status={statement.status}
                  />
                </td>
                <td className="py-4 text-neutral-600 font-medium">{statement.downloadCount}</td>
                <td className="py-4 text-right">
                  {statement.isDownloadable ? (
                    <button
                      onClick={() => onGenerateLink(statement)}
                      className="btn-capitec-outline"
                    >
                      Get Link
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {statements.map((statement) => (
          <div key={statement.id} className="border border-neutral-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-capitec-navy text-base">{statement.statementPeriod}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  {formatDateShort(statement.createdAt)}
                </div>
              </div>
              <StatusBadge
                isExpired={statement.isExpired}
                isDownloadable={statement.isDownloadable}
                status={statement.status}
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">File:</span>
                <span className="font-medium text-neutral-600 truncate ml-2 max-w-[60%]" title={statement.originalFileName}>
                  {statement.originalFileName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Size:</span>
                <span className="font-medium text-neutral-600">{statement.fileSizeMB} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Downloads:</span>
                <span className="font-medium text-neutral-600">{statement.downloadCount}</span>
              </div>
            </div>

            {statement.isDownloadable ? (
              <button
                onClick={() => onGenerateLink(statement)}
                className="btn-capitec-outline w-full"
              >
                Get Download Link
              </button>
            ) : (
              <div className="text-center text-xs text-neutral-400 py-2">Not available</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
