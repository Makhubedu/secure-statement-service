"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { config } from "@/lib/config";
import {
  StatementsTable,
  UploadStatementModal,
  DownloadLinkModal,
} from "./components";
import type { Statement, BaseResponse } from "./types";

export default function StatementsPage() {
  const { user } = useAuth();

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // List state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statements, setStatements] = useState<Statement[]>([]);

  // Generate link state
  const [linkModal, setLinkModal] = useState<{
    open: boolean;
    url: string;
    expiresAt?: string;
    fileName?: string;
    error?: string;
  }>({ open: false, url: "" });

  const apiBase = useMemo(() => config.api.apiPath, []);

  useEffect(() => {
    if (!user?.userId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${apiBase}/statements/mine`, {
          credentials: "include",
        });
        const json: BaseResponse<Statement[]> = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch statements");
        setStatements(json.data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load statements");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.userId, apiBase]);

  const refreshStatements = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/statements/mine`, {
        credentials: "include",
      });
      const json: BaseResponse<Statement[]> = await res.json();
      if (res.ok) setStatements(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async (statement: Statement) => {
    if (!user?.userId) return;
    try {
      setLinkModal({ open: true, url: "", fileName: statement.originalFileName });
      const res = await fetch(`${apiBase}/statements/${statement.id}/download-link`, {
        method: "GET",
        credentials: "include",
      });
      const json: BaseResponse<{
        downloadUrl: string;
        expiresAt: string;
        expiresInSeconds: number;
      }> = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to generate link");
      const url = json.data?.downloadUrl || "";
      setLinkModal({
        open: true,
        url,
        expiresAt: json.data?.expiresAt,
        fileName: statement.originalFileName,
      });
    } catch (e: any) {
      setLinkModal({ open: true, url: "", error: e.message });
    }
  };

  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-capitec-navy">Statements</h1>
          <p className="text-base md:text-lg mt-1 md:mt-2 text-neutral-400">Manage and view all financial statements</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)} 
          className="btn-capitec-primary hover-lift w-full sm:w-auto"
        >
          + Upload Statement
        </button>
      </div>

      <UploadStatementModal
        isOpen={showUploadModal}
        userEmail={user?.email}
        userId={user?.userId}
        apiBase={apiBase}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={refreshStatements}
      />

      <StatementsTable
        statements={statements}
        loading={loading}
        error={error}
        onRefresh={refreshStatements}
        onGenerateLink={handleGenerateLink}
      />

      <DownloadLinkModal
        isOpen={linkModal.open}
        url={linkModal.url}
        fileName={linkModal.fileName}
        expiresAt={linkModal.expiresAt}
        error={linkModal.error}
        onClose={() => setLinkModal({ open: false, url: "" })}
      />
    </div>
  );
}
