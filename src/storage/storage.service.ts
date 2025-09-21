import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';
import { PdfUtils } from '../common/utils';
import { PDF_CONSTANTS } from '../common/constants';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: MinioClient;
  private bucketName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const storageConfig = this.configService.get('storage');
    
    this.minioClient = new MinioClient({
      endPoint: storageConfig.endpoint,
      port: storageConfig.port,
      useSSL: storageConfig.useSSL,
      accessKey: storageConfig.accessKey,
      secretKey: storageConfig.secretKey,
    });

    this.bucketName = storageConfig.bucketName;
    
    await this.ensureBucketExists();
    this.logger.log(`Storage service initialized with bucket: ${this.bucketName}`);
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName);
        this.logger.log(`Created bucket: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to ensure bucket exists: ${error.message}`);
      throw error;
    }
  }

  async uploadPdf(
    file: Express.Multer.File,
    customerId: string,
    statementPeriod: string,
  ): Promise<{ fileName: string; storagePath: string }> {
    // Validate PDF file
    if (!this.validatePdfFile(file)) {
      throw new Error('Invalid PDF file');
    }

    // Generate unique filename and storage path
    const fileName = PdfUtils.generatePdfFileName();
    const storagePath = PdfUtils.generateStoragePath(customerId, statementPeriod, fileName);

    try {
      // Upload to MinIO
      await this.minioClient.putObject(
        this.bucketName,
        storagePath,
        file.buffer,
        file.size,
        {
          'Content-Type': PDF_CONSTANTS.MIME_TYPE,
          'Original-Name': file.originalname,
          'Customer-Id': customerId,
          'Statement-Period': statementPeriod,
        }
      );

      this.logger.log(`Successfully uploaded PDF: ${storagePath}`);
      return { fileName, storagePath };
    } catch (error) {
      this.logger.error(`Failed to upload PDF: ${error.message}`);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async generateDownloadUrl(storagePath: string, expiryHours: number = 24): Promise<string> {
    try {
      const expirySeconds = expiryHours * 3600;
      const downloadUrl = await this.minioClient.presignedGetObject(
        this.bucketName,
        storagePath,
        expirySeconds
      );

      this.logger.log(`Generated download URL for: ${storagePath}`);
      return downloadUrl;
    } catch (error) {
      this.logger.error(`Failed to generate download URL: ${error.message}`);
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, storagePath);
      this.logger.log(`Deleted file: ${storagePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileInfo(storagePath: string): Promise<any> {
    try {
      const stat = await this.minioClient.statObject(this.bucketName, storagePath);
      return stat;
    } catch (error) {
      this.logger.error(`Failed to get file info: ${error.message}`);
      throw new Error(`File not found: ${storagePath}`);
    }
  }

  private validatePdfFile(file: Express.Multer.File): boolean {
    // Check MIME type
    if (file.mimetype !== PDF_CONSTANTS.MIME_TYPE) {
      this.logger.warn(`Invalid MIME type: ${file.mimetype}`);
      return false;
    }

    // Check file size
    if (!PdfUtils.validatePdfSize(file.size)) {
      this.logger.warn(`Invalid file size: ${file.size} bytes`);
      return false;
    }

    // Check file extension
    if (!PdfUtils.validatePdfExtension(file.originalname)) {
      this.logger.warn(`Invalid file extension: ${file.originalname}`);
      return false;
    }

    return true;
  }
}
