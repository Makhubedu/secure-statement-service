import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString, IsIP } from 'class-validator';

export class GenerateDownloadLinkDto {
  @ApiProperty({
    description: 'Statement ID to generate download link for',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'Statement ID must be a valid UUID' })
  statementId: string;

  @ApiProperty({
    description: 'Customer ID requesting the download (for authorization)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @ApiProperty({
    description: 'IP address of the requester (for audit)',
    example: '192.168.1.1',
    required: false
  })
  @IsOptional()
  @IsIP(undefined, { message: 'Must be a valid IP address' })
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent of the requester (for audit)',
    example: 'Mozilla/5.0...',
    required: false
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}