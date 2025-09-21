import { ApiProperty } from '@nestjs/swagger';
import { StatementStatus } from '../enums';

export class StatementResponseDto {
  @ApiProperty({ description: 'Statement unique identifier' })
  id: string;

  @ApiProperty({ description: 'Generated filename for storage' })
  fileName: string;

  @ApiProperty({ description: 'Original filename from upload' })
  originalFileName: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSizeBytes: number;

  @ApiProperty({ description: 'Statement period (YYYY-MM)' })
  statementPeriod: string;

  @ApiProperty({ description: 'Statement date' })
  statementDate: string;

  @ApiProperty({ enum: StatementStatus, description: 'Current status of the statement' })
  status: StatementStatus;

  @ApiProperty({ description: 'Download expiry date', required: false })
  expiresAt?: string;

  @ApiProperty({ description: 'Number of times downloaded' })
  downloadCount: number;

  @ApiProperty({ description: 'Who uploaded the statement', required: false })
  uploadedBy?: string;

  @ApiProperty({ description: 'Customer ID who owns this statement' })
  customerId: string;

  @ApiProperty({ description: 'When the statement was created' })
  createdAt: string;

  @ApiProperty({ description: 'When the statement was last updated' })
  updatedAt: string;

  @ApiProperty({ description: 'Whether the statement is expired' })
  isExpired: boolean;

  @ApiProperty({ description: 'Whether the statement is downloadable' })
  isDownloadable: boolean;

  @ApiProperty({ description: 'File size formatted for display' })
  fileSizeMB: number;
}