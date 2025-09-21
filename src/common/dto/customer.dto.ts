import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Unique customer number',
    example: 'CUST001'
  })
  @IsString()
  customerNumber: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John'
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe'
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com'
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Whether the customer is active',
    example: true,
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer unique identifier' })
  id: string;

  @ApiProperty({ description: 'Unique customer number' })
  customerNumber: string;

  @ApiProperty({ description: 'Customer first name' })
  firstName: string;

  @ApiProperty({ description: 'Customer last name' })
  lastName: string;

  @ApiProperty({ description: 'Customer full name' })
  fullName: string;

  @ApiProperty({ description: 'Customer email address' })
  email: string;

  @ApiProperty({ description: 'Customer phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Whether the customer is active' })
  isActive: boolean;

  @ApiProperty({ description: 'When the customer was created' })
  createdAt: string;

  @ApiProperty({ description: 'When the customer was last updated' })
  updatedAt: string;

  @ApiProperty({ description: 'Number of statements for this customer' })
  statementCount?: number;
}