import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  provider: process.env.STORAGE_PROVIDER,
  endpoint: process.env.STORAGE_ENDPOINT,
  port: parseInt(process.env.STORAGE_PORT!, 10),
  externalEndpoint: process.env.STORAGE_EXTERNAL_ENDPOINT || process.env.STORAGE_ENDPOINT,
  externalPort: parseInt(process.env.STORAGE_EXTERNAL_PORT!, 10) || parseInt(process.env.STORAGE_PORT!, 10),
  accessKey: process.env.STORAGE_ACCESS_KEY!,
  secretKey: process.env.STORAGE_SECRET_KEY!,
  bucketName: process.env.STORAGE_BUCKET_NAME!,
  useSSL: process.env.STORAGE_USE_SSL === 'true' || false,
  pathStyle: process.env.STORAGE_PATH_STYLE === 'true' || true,
}));