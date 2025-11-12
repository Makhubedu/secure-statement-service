"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { config } from "@/lib/config";
import { formatFileSize, formatDate } from "@/lib/format-utils";
import { ERROR_MESSAGES, USER_ROLES } from "@/lib/constants";
import type { Statement, DownloadLog } from "@/types";

export default function DownloadLogsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<DownloadLog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const apiBase = useMemo(() => config.api.apiPath, []);

  useEffect(() => {
    if (!user?.userId) return;
    
    const adminCheck = user.roles?.includes(USER_ROLES.ADMIN) || false;
    setIsAdmin(adminCheck);
    
    const fetchDownloadLogs = async () => {
      try {
        setLoading(true);
        setError("");
        
        // First, get all statements for the user
        const statementsRes = await fetch(`${apiBase}/statements/mine`, {
          credentials: "include",
        });
        const statementsJson = await statementsRes.json();
        
        if (!statementsRes.ok) {
          throw new Error(statementsJson.message || ERROR_MESSAGES.DOWNLOAD_LOGS.FETCH_FAILED);
        }
        
        const statements: Statement[] = statementsJson.data || [];
        
        if (!adminCheck) {
          setLogs([]);
          setLoading(false);
          return;
        }
        
        const logsPromises = statements.map(async (statement) => {
          try {
            const logsRes = await fetch(`${apiBase}/statements/${statement.id}/download-logs`, {
              credentials: "include",
            });
            const logsJson = await logsRes.json();
            
            if (logsRes.ok && logsJson.data) {
              return logsJson.data as DownloadLog[];
            }
            return [];
          } catch {
            return [];
          }
        });
        
        const allLogsArrays = await Promise.all(logsPromises);
        const allLogs = allLogsArrays.flat();
        
        allLogs.sort((a, b) => 
          new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime()
        );
        
        setLogs(allLogs);
        
      } catch (e) {
        const error = e as Error;
        setError(error.message || ERROR_MESSAGES.DOWNLOAD_LOGS.FETCH_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadLogs();
  }, [user?.userId, user?.roles, apiBase]);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "success" || statusLower === "completed" || statusLower === "initiated") {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-capitec-green">Success</span>;
    }
    if (statusLower === "failed" || statusLower === "error") {
      return <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-capitec-red">Failed</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">{status}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Download Logs</h1>
          <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">
            View all statement download history and audit trail
          </p>
        </div>
        <div className="card-capitec p-6 md:p-12">
          <div className="py-12 text-center text-neutral-400">Loading download logs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Download Logs</h1>
          <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">
            View all statement download history and audit trail
          </p>
        </div>
        <div className="card-capitec p-4 md:p-6">
          <div className="alert-capitec-error">{error}</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Download Logs</h1>
          <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">
            View all statement download history and audit trail
          </p>
        </div>

        <div className="card-capitec p-6 md:p-12">
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <div className="icon-bg-blue mb-4 md:mb-6">
              <svg className="h-12 w-12 md:h-20 md:w-20 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-capitec-navy">Download logs available for admins only</h3>
            <p className="text-sm md:text-base max-w-md text-neutral-400">
              You can view the download count for each statement on the Statements page. Detailed download logs are available for administrators only.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Download Logs</h1>
        <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">
          View all statement download history and audit trail
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="card-capitec p-6 md:p-12">
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <div className="icon-bg-blue mb-4 md:mb-6">
              <svg className="h-12 w-12 md:h-20 md:w-20 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-capitec-navy">No download logs yet</h3>
            <p className="text-sm md:text-base max-w-md text-neutral-400">
              Download logs will appear here once statements have been downloaded.
            </p>
          </div>
        </div>
      ) : (
        <div className="card-capitec overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    Statement
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    Downloaded At
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold text-capitec-navy uppercase tracking-wider">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-capitec-navy">
                        {log.statement.originalFileName}
                      </div>
                      {log.errorMessage && (
                        <div className="text-xs text-capitec-red mt-1">
                          Error: {log.errorMessage}
                        </div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-neutral-600">
                        {log.statement.statementPeriod}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-neutral-600">
                        {formatDate(log.downloadedAt)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-mono text-neutral-600">
                        {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-neutral-600">
                        {formatFileSize(log.statement.fileSizeBytes)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
