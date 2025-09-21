import { DataSource } from 'typeorm';
import { Customer, Statement, DownloadLog } from './src/common/entities';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  logging: process.env.DB_LOGGING === 'true' || false,
  entities: [Customer, Statement, DownloadLog],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migration_table',
});