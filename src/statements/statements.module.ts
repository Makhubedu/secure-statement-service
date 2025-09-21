import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StatementsService } from './statements.service';
import { StatementsController } from './statements.controller';
import { Statement, DownloadLog } from '../common/entities';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statement, DownloadLog]),
    ConfigModule,
    StorageModule,
  ],
  controllers: [StatementsController],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {}
