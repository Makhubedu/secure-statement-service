import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Customer, Statement, DownloadLog } from '../common/entities';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
    entities: [Customer, Statement, DownloadLog],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS!, 10),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY!, 10),
    autoLoadEntities: true,
    ssl: process.env.DB_SSL === 'true',
  }),
);