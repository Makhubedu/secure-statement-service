import { Controller, Post, Body, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto, AuthResponseDto, LogoutResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class UserController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate with admin credentials only'
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.loginUser(
      loginDto.email,
      loginDto.password,
      req,
      res,
    );

    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }

    const response: AuthResponseDto = {
      success: result.success,
      userId: result.userId,
      email: result.email,
      roles: result.roles,
      message: result.message,
    };

    return res.status(200).json(response);
  }

  @Post('logout')
  @ApiOperation({ 
    summary: 'Logout user',
    description: 'Revoke user session and clear authentication cookies'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Logout successful',
    type: LogoutResponseDto
  })
  @ApiResponse({ status: 401, description: 'No active session' })
  async logout(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.logoutUser(req, res);

    const response: LogoutResponseDto = {
      success: result.success,
      message: result.message,
    };

    return res.status(200).json(response);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get current user info',
    description: 'Get information about the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User information retrieved',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.getCurrentUser(req, res);

    if (!result.success) {
      throw new UnauthorizedException(result.error);
    }

    const response: AuthResponseDto = {
      success: result.success,
      userId: result.userId,
      email: result.email,
      roles: result.roles,
      message: result.message,
    };

    return res.status(200).json(response);
  }
}