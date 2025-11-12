export interface User {
  userId: string;
  email: string;
  roles: string[];
}

export interface Statement {
  id: string;
  fileName: string;
  originalFileName: string;
  fileSizeBytes: number;
  fileSizeMB: number;
  statementPeriod: string;
  statementDate: string;
  status: string;
  downloadCount: number;
  createdAt: string;
  expiresAt?: string;
  isExpired?: boolean;
  isDownloadable?: boolean;
}

export interface DownloadLog {
  id: string;
  statementId: string;
  userId?: string;
  status: string;
  ipAddress: string;
  userAgent?: string;
  downloadedAt: string;
  errorMessage?: string;
  statement: {
    fileName: string;
    originalFileName: string;
    statementPeriod: string;
    fileSizeBytes: number;
  };
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface DownloadLinkResponse {
  downloadUrl: string;
  expiresAt: string;
  expiresInSeconds: number;
}

export interface DashboardStats {
  total: number;
  downloaded: number;
  available: number;
}
