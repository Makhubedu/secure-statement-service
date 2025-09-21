import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatementsModule } from './statements/statements.module';
import { StorageModule } from './storage/storage.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { appConfig, databaseConfig, storageConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, storageConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    StatementsModule,
    StorageModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
