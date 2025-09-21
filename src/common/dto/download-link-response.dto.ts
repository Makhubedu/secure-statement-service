import { ApiProperty } from '@nestjs/swagger';

export class DownloadLinkResponseDto {
  @ApiProperty({
    description: 'Signed download URL',
    example: 'https://minio.example.com/statements/file.pdf?X-Amz-Algorithm=...'
  })
  downloadUrl: string;

  @ApiProperty({
    description: 'When the download link expires',
    example: '2024-03-31T23:59:59.000Z'
  })
  expiresAt: string;

  @ApiProperty({
    description: 'Time remaining until expiry in seconds',
    example: 86400
  })
  expiresInSeconds: number;

  @ApiProperty({
    description: 'Statement information'
  })
  statement: {
    id: string;
    fileName: string;
    originalFileName: string;
    fileSizeBytes: number;
    fileSizeMB: number;
    statementPeriod: string;
    downloadCount: number;
  };

  @ApiProperty({
    description: 'Security token for the download (if needed)',
    required: false
  })
  token?: string;
}