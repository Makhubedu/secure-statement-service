export type Statement = {
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
};

export type BaseResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
