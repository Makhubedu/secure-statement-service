import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StatementsModule } from './statements/statements.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { appConfig, databaseConfig, storageConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, storageConfig],
      envFilePath: ['.env.dev', '.env'],
    }),
    AuthModule.forRoot(),
    DatabaseModule,
    StatementsModule,
    StorageModule,
    HealthModule,
  ]
})
export class AppModule {}
