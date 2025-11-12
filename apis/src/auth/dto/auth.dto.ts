import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@yourdomain.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'AdminPassword123!',
  })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Operation success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  userId: string;

  @ApiProperty({
    description: 'User email',
    example: 'admin@yourdomain.com',
  })
  email: string;

  @ApiProperty({
    description: 'User roles',
    example: ['admin'],
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: 'Session tokens (set as HTTP-only cookies)',
    example: 'Session tokens are automatically set as secure HTTP-only cookies',
  })
  message?: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Logout message',
    example: 'Successfully logged out',
  })
  message: string;
}