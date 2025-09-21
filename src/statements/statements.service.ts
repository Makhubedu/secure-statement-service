import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { StorageService } from '../storage/storage.service';
import { Statement, DownloadLog, Customer } from '../common/entities';
import { StatementStatus, DownloadStatus } from '../common/enums';
import { PDF_CONSTANTS } from '../common/constants';
import { PdfUtils } from '../common/utils';
import {
  CreateStatementDto,
  StatementResponseDto,
  GenerateDownloadLinkDto,
  DownloadLinkResponseDto,
  DownloadLogResponseDto,
} from '../common/dto';

@Injectable()
export class StatementsService {
  private readonly logger = new Logger(StatementsService.name);

  constructor(
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(DownloadLog)
    private downloadLogRepository: Repository<DownloadLog>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private storageService: StorageService,
    private configService: ConfigService,
  ) {}

  async uploadStatement(
    createStatementDto: CreateStatementDto,
    file: Express.Multer.File,
  ): Promise<StatementResponseDto> {
    this.logger.log(`Uploading statement for customer: ${createStatementDto.customerId}`);

    // Verify customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: createStatementDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate file
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    // Check for duplicate statement
    const existingStatement = await this.statementRepository.findOne({
      where: {
        customerId: createStatementDto.customerId,
        statementPeriod: createStatementDto.statementPeriod,
      },
    });
    if (existingStatement) {
      throw new BadRequestException(
        `Statement for period ${createStatementDto.statementPeriod} already exists for this customer`
      );
    }

    try {
      // Upload to storage
      const { fileName, storagePath } = await this.storageService.uploadPdf(
        file,
        createStatementDto.customerId,
        createStatementDto.statementPeriod,
      );

      // Create statement entity
      const statement = this.statementRepository.create({
        fileName,
        originalFileName: file.originalname,
        fileSizeBytes: file.size,
        mimeType: PDF_CONSTANTS.MIME_TYPE,
        storagePath,
        statementDate: new Date(createStatementDto.statementDate),
        statementPeriod: createStatementDto.statementPeriod,
        status: StatementStatus.AVAILABLE, // Set to AVAILABLE immediately after successful upload
        expiresAt: PdfUtils.generateExpiryDate(),
        downloadCount: 0,
        uploadedBy: createStatementDto.uploadedBy,
        customerId: createStatementDto.customerId,
      });

      const savedStatement = await this.statementRepository.save(statement);
      this.logger.log(`Statement uploaded successfully: ${savedStatement.id}`);

      return this.mapToResponseDto(savedStatement);
    } catch (error) {
      this.logger.error(`Failed to upload statement: ${error.message}`);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async generateDownloadLink(
    generateDownloadDto: GenerateDownloadLinkDto,
  ): Promise<DownloadLinkResponseDto> {
    this.logger.log(`Generating download link for statement: ${generateDownloadDto.statementId}`);

    // Find statement
    const statement = await this.statementRepository.findOne({
      where: { id: generateDownloadDto.statementId },
      relations: ['customer'],
    });

    if (!statement) {
      throw new NotFoundException('Statement not found');
    }

    // Verify customer ownership
    if (statement.customerId !== generateDownloadDto.customerId) {
      throw new BadRequestException('Statement does not belong to this customer');
    }

    // Check if statement is downloadable
    if (!statement.isDownloadable) {
      throw new BadRequestException('Statement is not available for download');
    }

    try {
      // Generate signed URL
      const downloadUrl = await this.storageService.generateDownloadUrl(
        statement.storagePath,
        PDF_CONSTANTS.DOWNLOAD_LINK_EXPIRY_MINUTES,
      );

      // Log download request
      await this.logDownloadAttempt(
        statement.id,
        DownloadStatus.INITIATED,
        generateDownloadDto.ipAddress,
        generateDownloadDto.userAgent,
      );

      // Update download count
      await this.statementRepository.update(statement.id, {
        downloadCount: statement.downloadCount + 1,
      });

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + PDF_CONSTANTS.DOWNLOAD_LINK_EXPIRY_MINUTES);

      this.logger.log(`Download link generated for statement: ${statement.id}`);

      return {
        downloadUrl,
        expiresAt: expiryDate.toISOString(),
        expiresInSeconds: PDF_CONSTANTS.DOWNLOAD_LINK_EXPIRY_MINUTES * 60,
        statement: {
          id: statement.id,
          fileName: statement.fileName,
          originalFileName: statement.originalFileName,
          fileSizeBytes: statement.fileSizeBytes,
          fileSizeMB: statement.fileSizeMB,
          statementPeriod: statement.statementPeriod,
          downloadCount: statement.downloadCount + 1,
        },
      };
    } catch (error) {
      // Log failed attempt
      await this.logDownloadAttempt(
        statement.id,
        DownloadStatus.FAILED,
        generateDownloadDto.ipAddress,
        generateDownloadDto.userAgent,
        error.message,
      );

      this.logger.error(`Failed to generate download link: ${error.message}`);
      throw new BadRequestException(`Failed to generate download link: ${error.message}`);
    }
  }

  async getStatementsByCustomer(customerId: string): Promise<StatementResponseDto[]> {
    const statements = await this.statementRepository.find({
      where: { customerId },
      order: { statementDate: 'DESC' },
    });

    return statements.map(statement => this.mapToResponseDto(statement));
  }

  async getStatementById(id: string): Promise<StatementResponseDto> {
    const statement = await this.statementRepository.findOne({
      where: { id },
    });

    if (!statement) {
      throw new NotFoundException('Statement not found');
    }

    return this.mapToResponseDto(statement);
  }

  async getDownloadLogs(statementId: string): Promise<DownloadLogResponseDto[]> {
    const logs = await this.downloadLogRepository.find({
      where: { statementId },
      relations: ['statement'],
      order: { createdAt: 'DESC' },
    });

    return logs.map(log => ({
      id: log.id,
      statementId: log.statementId,
      customerId: log.statement.customerId, // Get from related statement
      status: log.status,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      downloadedAt: log.createdAt.toISOString(), // Use createdAt as download time
      downloadSizeBytes: log.statement.fileSizeBytes, // Get from statement
      errorMessage: log.errorMessage,
      createdAt: log.createdAt.toISOString(),
      statement: {
        fileName: log.statement.fileName,
        originalFileName: log.statement.originalFileName,
        statementPeriod: log.statement.statementPeriod,
        fileSizeBytes: log.statement.fileSizeBytes,
      },
    }));
  }

  private async logDownloadAttempt(
    statementId: string,
    status: DownloadStatus,
    ipAddress?: string,
    userAgent?: string,
    errorMessage?: string,
  ): Promise<void> {
    const downloadLog = this.downloadLogRepository.create({
      statementId,
      status,
      ipAddress: ipAddress || 'unknown',
      userAgent,
      errorMessage,
    });

    await this.downloadLogRepository.save(downloadLog);
  }

  private mapToResponseDto(statement: Statement): StatementResponseDto {
    return {
      id: statement.id,
      fileName: statement.fileName,
      originalFileName: statement.originalFileName,
      fileSizeBytes: statement.fileSizeBytes,
      statementPeriod: statement.statementPeriod,
      statementDate: statement.statementDate instanceof Date 
        ? statement.statementDate.toISOString()
        : new Date(statement.statementDate).toISOString(),
      status: statement.status,
      expiresAt: statement.expiresAt 
        ? (statement.expiresAt instanceof Date 
          ? statement.expiresAt.toISOString()
          : new Date(statement.expiresAt).toISOString())
        : undefined,
      downloadCount: statement.downloadCount,
      uploadedBy: statement.uploadedBy,
      customerId: statement.customerId,
      createdAt: statement.createdAt instanceof Date 
        ? statement.createdAt.toISOString()
        : new Date(statement.createdAt).toISOString(),
      updatedAt: statement.updatedAt instanceof Date 
        ? statement.updatedAt.toISOString()
        : new Date(statement.updatedAt).toISOString(),
      isExpired: statement.isExpired,
      isDownloadable: statement.isDownloadable,
      fileSizeMB: statement.fileSizeMB,
    };
  }
}
