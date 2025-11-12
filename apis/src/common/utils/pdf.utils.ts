import { randomUUID } from 'crypto';
import { PDF_CONSTANTS } from '../constants';

export class PdfUtils {
  /**
   * Generate a unique filename for PDF storage
   */
  static generatePdfFileName(): string {
    const uuid = randomUUID();
    return `${uuid}${PDF_CONSTANTS.FILE_EXTENSION}`;
  }

  /**
   * Extract file extension and validate it's a PDF
   */
  static validatePdfExtension(filename: string): boolean {
    return filename.toLowerCase().endsWith(PDF_CONSTANTS.FILE_EXTENSION);
  }

  /**
   * Generate storage path for MinIO
   */
  static generateStoragePath(userId: string, period: string, fileName: string): string {
    return `statements/${userId}/${period}/${fileName}`;
  }

  /**
   * Parse statement period from filename or date
   */
  static generateStatementPeriod(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Validate file size is within PDF limits
   */
  static validatePdfSize(sizeBytes: number): boolean {
    return sizeBytes >= PDF_CONSTANTS.MIN_FILE_SIZE && 
           sizeBytes <= PDF_CONSTANTS.MAX_FILE_SIZE;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${Math.round(size * 100) / 100} ${sizes[i]}`;
  }

  /**
   * Generate expiry date for download link
   */
  static generateExpiryDate(minutesFromNow: number = PDF_CONSTANTS.DOWNLOAD_LINK_EXPIRY_MINUTES): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutesFromNow);
    return expiry;
  }
}