import { DataSource } from 'typeorm';
import { Statement, DownloadLog } from './src/common/entities';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
// Try .env.local first (for local development), fallback to .env
const localEnvPath = path.resolve(__dirname, '.env.local');
const defaultEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(localEnvPath)) {
  console.log('Loading environment from .env.local');
  dotenv.config({ path: localEnvPath });
} else {
  console.log('Loading environment from .env');
  dotenv.config({ path: defaultEnvPath });
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  logging: process.env.DB_LOGGING === 'true' || false,
  entities: [Statement, DownloadLog],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migration_table',
});