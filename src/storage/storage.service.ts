import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand, CreateBucketCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { PdfUtils } from '../common/utils';
import { PDF_CONSTANTS } from '../common/constants';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private forcePathStyle: boolean;
  private externalEndpoint: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const storageConfig = this.configService.get('storage');
    
    // Store configuration for URL generation
    this.bucketName = storageConfig.bucketName;
    this.forcePathStyle = storageConfig.pathStyle || true;
    this.externalEndpoint = `http://${storageConfig.externalEndpoint || 'localhost'}:${storageConfig.externalPort || 9002}`;
    
    // Initialize S3 client with MinIO configuration
    this.s3Client = new S3Client({
      endpoint: `http://${storageConfig.endpoint}:${storageConfig.port}`,
      region: 'us-east-1', // MinIO default region
      credentials: {
        accessKeyId: storageConfig.accessKey,
        secretAccessKey: storageConfig.secretKey,
      },
      forcePathStyle: this.forcePathStyle, // Required for MinIO
    });

    await this.ensureBucketExists();
    this.logger.log(`Storage service initialized with bucket: ${this.bucketName}`);
    this.logger.log(`Internal endpoint: ${storageConfig.endpoint}:${storageConfig.port}`);
    this.logger.log(`External endpoint: ${this.externalEndpoint}`);
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
      this.logger.log(`Bucket '${this.bucketName}' already exists`);
    } catch (error) {
      if (error.name === 'NotFound') {
        // Create bucket if it doesn't exist
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
        this.logger.log(`Created bucket: ${this.bucketName}`);
      } else {
        this.logger.error(`Error checking bucket: ${error.message}`);
        throw error;
      }
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
      // Upload to MinIO using AWS SDK v3
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
        Body: file.buffer,
        ContentType: PDF_CONSTANTS.MIME_TYPE,
        Metadata: {
          'original-name': file.originalname,
          'customer-id': customerId,
          'statement-period': statementPeriod,
        },
      });

      await this.s3Client.send(putCommand);

      this.logger.log(`Successfully uploaded PDF: ${storagePath}`);
      return { fileName, storagePath };
    } catch (error) {
      this.logger.error(`Failed to upload PDF: ${error.message}`);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async generateDownloadUrl(storagePath: string, expiryMinutes: number = 5): Promise<string> {
    try {
      const expirySeconds = expiryMinutes * 60;
      
      // Create S3 client specifically for external URL generation
      const storageConfig = this.configService.get('storage');
      const externalS3Client = new S3Client({
        endpoint: this.externalEndpoint,
        region: 'us-east-1',
        credentials: {
          accessKeyId: storageConfig.accessKey,
          secretAccessKey: storageConfig.secretKey,
        },
        forcePathStyle: this.forcePathStyle,
      });

      // Generate presigned URL with external endpoint
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
      });

      const downloadUrl = await getSignedUrl(externalS3Client, getCommand, {
        expiresIn: expirySeconds,
      });

      this.logger.log(`Generated download URL for: ${storagePath}`);
      this.logger.log(`Download URL: ${downloadUrl}`);
      
      return downloadUrl;
    } catch (error) {
      this.logger.error(`Failed to generate download URL: ${error.message}`);
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
      });
      
      await this.s3Client.send(deleteCommand);
      this.logger.log(`Deleted file: ${storagePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async getFileInfo(storagePath: string): Promise<any> {
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
      });
      
      const result = await this.s3Client.send(headCommand);
      return result;
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
