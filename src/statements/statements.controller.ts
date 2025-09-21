import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { StatementsService } from './statements.service';
import {
  CreateStatementDto,
  StatementResponseDto,
  GenerateDownloadLinkDto,
  DownloadLinkResponseDto,
  DownloadLogResponseDto,
  BaseResponseDto,
} from '../common/dto';
import { AuthGuard, RolesGuard, Roles } from '../auth';

@ApiTags('Statements')
@Controller('statements')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ 
    summary: 'Upload a PDF statement',
    description: 'Admin endpoint to upload PDF statements for users'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF file to upload'
        },
        userId: {
          type: 'string',
          format: 'uuid',
          description: 'User ID who owns this statement'
        },
        statementPeriod: {
          type: 'string',
          pattern: '^\\d{4}-\\d{2}$',
          example: '2024-03',
          description: 'Statement period in YYYY-MM format'
        },
        statementDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-03-31T00:00:00.000Z',
          description: 'Statement date'
        },
        uploadedBy: {
          type: 'string',
          example: 'admin@company.com',
          description: 'User who uploaded the statement (optional)'
        }
      },
      required: ['file', 'userId', 'statementPeriod', 'statementDate']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Statement uploaded successfully',
    type: BaseResponseDto<StatementResponseDto>
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or file validation failed'
  })
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) createStatementDto: CreateStatementDto,
  ): Promise<BaseResponseDto<StatementResponseDto>> {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    const statement = await this.statementsService.uploadStatement(createStatementDto, file);
    
    return BaseResponseDto.success(
      'Statement uploaded successfully',
      statement
    );
  }

  @Post('download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate secure download link',
    description: 'Generate a time-limited signed URL for statement download'
  })
  @ApiResponse({
    status: 200,
    description: 'Download link generated successfully',
    type: BaseResponseDto<DownloadLinkResponseDto>
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found'
  })
  @ApiResponse({
    status: 400,
    description: 'Statement not available for download or validation failed'
  })
  async generateDownloadLink(
    @Body(ValidationPipe) generateDownloadDto: GenerateDownloadLinkDto,
    @Req() request: Request,
  ): Promise<BaseResponseDto<DownloadLinkResponseDto>> {
    // Extract IP and User-Agent from request
    const ipAddress = request.ip || request.connection.remoteAddress || request.socket.remoteAddress || 'unknown';
    const userAgent = request.get('User-Agent');

    const downloadLinkData = await this.statementsService.generateDownloadLink({
      ...generateDownloadDto,
      ipAddress,
      userAgent,
    });

    return BaseResponseDto.success(
      'Download link generated successfully',
      downloadLinkData
    );
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get statements by user',
    description: 'Retrieve all statements for a specific user'
  })
  @ApiResponse({
    status: 200,
    description: 'User statements retrieved successfully',
    type: BaseResponseDto<StatementResponseDto[]>
  })
  async getStatementsByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<BaseResponseDto<StatementResponseDto[]>> {
    const statements = await this.statementsService.getStatementsByUser(userId);
    
    return BaseResponseDto.success(
      `Found ${statements.length} statements for user`,
      statements
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get statement by ID',
    description: 'Retrieve a specific statement by its ID'
  })
  @ApiResponse({
    status: 200,
    description: 'Statement retrieved successfully',
    type: BaseResponseDto<StatementResponseDto>
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found'
  })
  async getStatementById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseResponseDto<StatementResponseDto>> {
    const statement = await this.statementsService.getStatementById(id);
    
    return BaseResponseDto.success(
      'Statement retrieved successfully',
      statement
    );
  }

  @Get(':id/download-logs')
  @ApiOperation({
    summary: 'Get download logs for statement',
    description: 'Retrieve audit logs of all download attempts for a statement'
  })
  @ApiResponse({
    status: 200,
    description: 'Download logs retrieved successfully',
    type: BaseResponseDto<DownloadLogResponseDto[]>
  })
  @ApiResponse({
    status: 404,
    description: 'Statement not found'
  })
  async getDownloadLogs(
    @Param('id', ParseUUIDPipe) statementId: string,
  ): Promise<BaseResponseDto<DownloadLogResponseDto[]>> {
    const logs = await this.statementsService.getDownloadLogs(statementId);
    
    return BaseResponseDto.success(
      `Found ${logs.length} download log entries`,
      logs
    );
  }
}