import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateStatementDto {
  @ApiProperty({ 
    description: 'Customer ID who owns this statement',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'Customer ID must be a valid UUID' })
  customerId: string;

  @ApiProperty({
    description: 'Statement period in YYYY-MM format',
    example: '2024-03',
    pattern: '^\\d{4}-\\d{2}$'
  })
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Statement period must be in YYYY-MM format'
  })
  statementPeriod: string;

  @ApiProperty({
    description: 'Statement date',
    example: '2024-03-31T00:00:00.000Z'
  })
  @IsDateString({}, { message: 'Statement date must be a valid ISO date string' })
  statementDate: string;

  @ApiProperty({
    description: 'User ID who uploaded the statement',
    example: 'admin@company.com',
    required: false
  })
  @IsOptional()
  @IsString()
  uploadedBy?: string;
}