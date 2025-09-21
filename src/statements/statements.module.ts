import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StatementsService } from './statements.service';
import { StatementsController } from './statements.controller';
import { CustomersController } from './customers.controller';
import { Statement, DownloadLog, Customer } from '../common/entities';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Statement, DownloadLog, Customer]),
    ConfigModule,
    StorageModule,
  ],
  controllers: [StatementsController, CustomersController],
  providers: [StatementsService],
  exports: [StatementsService],
})
export class StatementsModule {}
