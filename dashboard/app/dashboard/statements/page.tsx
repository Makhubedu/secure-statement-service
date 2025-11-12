"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { config } from "@/lib/config";
import { ERROR_MESSAGES } from "@/lib/constants";
import {
  StatementsTable,
  UploadStatementModal,
  DownloadLinkModal,
} from "./components";
import type { Statement, BaseResponse, DownloadLinkResponse } from "@/types";

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
        if (!res.ok) throw new Error(json.message || ERROR_MESSAGES.STATEMENTS.FETCH_FAILED);
        setStatements(json.data || []);
      } catch (e) {
        const error = e as Error;
        setError(error.message || ERROR_MESSAGES.STATEMENTS.FETCH_FAILED);
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
      const json: BaseResponse<DownloadLinkResponse> = await res.json();
      if (!res.ok) throw new Error(json.message || ERROR_MESSAGES.STATEMENTS.LINK_GENERATION_FAILED);
      const url = json.data?.downloadUrl || "";
      setLinkModal({
        open: true,
        url,
        expiresAt: json.data?.expiresAt,
        fileName: statement.originalFileName,
      });
    } catch (e) {
      const error = e as Error;
      setLinkModal({ open: true, url: "", error: error.message });
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
