import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StatementsService } from './statements.service';
import { Statement, DownloadLog, Customer } from '../common/entities';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statement, DownloadLog, Customer]),
    ConfigModule,
    StorageModule,
  ],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {}
