import { ApiProperty } from '@nestjs/swagger';
import { DownloadStatus } from '../enums';

export class DownloadLogResponseDto {
  @ApiProperty({ description: 'Download log unique identifier' })
  id: string;

  @ApiProperty({ description: 'Statement ID that was downloaded' })
  statementId: string;

  @ApiProperty({ description: 'User ID who downloaded' })
  userId: string;

  @ApiProperty({ enum: DownloadStatus, description: 'Status of the download attempt' })
  status: DownloadStatus;

  @ApiProperty({ description: 'IP address of the downloader' })
  ipAddress: string;

  @ApiProperty({ description: 'User agent of the downloader', required: false })
  userAgent?: string;

  @ApiProperty({ description: 'When the download was initiated' })
  downloadedAt: string;

  @ApiProperty({ description: 'File size downloaded in bytes', required: false })
  downloadSizeBytes?: number;

  @ApiProperty({ description: 'Error message if download failed', required: false })
  errorMessage?: string;

  @ApiProperty({ description: 'When the log entry was created' })
  createdAt: string;

  @ApiProperty({ description: 'Statement information' })
  statement: {
    fileName: string;
    originalFileName: string;
    statementPeriod: string;
    fileSizeBytes: number;
  };
}