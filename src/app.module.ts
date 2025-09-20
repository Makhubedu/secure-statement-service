import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatementsModule } from './statements/statements.module';
import { StorageModule } from './storage/storage.module';
import { AuditModule } from './audit/audit.module';
import { DownloadModule } from './download/download.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [StatementsModule, StorageModule, AuditModule, DownloadModule, HealthModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
