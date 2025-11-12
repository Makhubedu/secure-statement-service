"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { config } from "@/lib/config";

type Statement = {
  id: string;
  downloadCount: number;
  isDownloadable: boolean;
  status: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<Statement[]>([]);
  const apiBase = useMemo(() => config.api.apiPath, []);

  useEffect(() => {
    if (!user?.userId) return;
    
    const fetchStatements = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/statements/mine`, {
          credentials: "include",
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setStatements(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch statements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, [user?.userId, apiBase]);

  const stats = useMemo(() => {
    const total = statements.length;
    const downloaded = statements.reduce((sum, s) => sum + s.downloadCount, 0);
    const available = statements.filter(s => s.isDownloadable).length;
    
    return { total, downloaded, available };
  }, [statements]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Dashboard</h1>
        <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">
          Welcome to the Secure Statement Service dashboard
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card-capitec-stat card-capitec-stat-blue">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-400">Total Statements</h3>
            <div className="icon-bg-blue">
              <svg className="h-6 w-6 md:h-8 md:w-8 text-capitec-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 md:mt-6 text-4xl md:text-5xl font-bold text-capitec-navy">
            {loading ? "..." : stats.total}
          </p>
          <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-neutral-400">All time</p>
        </div>
        
        <div className="card-capitec-stat card-capitec-stat-green">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-400">Total Downloads</h3>
            <div className="icon-bg-green">
              <svg className="h-6 w-6 md:h-8 md:w-8 text-capitec-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
          </div>
          <p className="mt-4 md:mt-6 text-4xl md:text-5xl font-bold text-capitec-navy">
            {loading ? "..." : stats.downloaded}
          </p>
          <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-neutral-400">All downloads</p>
        </div>
        
        <div className="card-capitec-stat card-capitec-stat-red sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-neutral-400">Available</h3>
            <div className="icon-bg-red">
              <svg className="h-6 w-6 md:h-8 md:w-8 text-capitec-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 md:mt-6 text-4xl md:text-5xl font-bold text-capitec-navy">
            {loading ? "..." : stats.available}
          </p>
          <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium text-neutral-400">Ready to download</p>
        </div>
      </div>
    </div>
  );
}
