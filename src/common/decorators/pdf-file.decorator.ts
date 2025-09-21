import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { PDF_CONSTANTS, PDF_VALIDATION } from '../constants';

export const PdfFile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    if (file.mimetype !== PDF_CONSTANTS.MIME_TYPE) {
      throw new BadRequestException('Only PDF files are allowed');
    }

    if (file.size > PDF_CONSTANTS.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${PDF_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    if (file.size < PDF_CONSTANTS.MIN_FILE_SIZE) {
      throw new BadRequestException('File is too small to be a valid PDF');
    }

    return file;
  },
);

export const ValidatePdfBuffer = (buffer: Buffer): boolean => {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  const magicNumbers = PDF_VALIDATION.MAGIC_NUMBERS.PDF;
  return magicNumbers.every((byte, index) => buffer[index] === byte);
};