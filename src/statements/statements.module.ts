import { Module } from '@nestjs/common';
import { StatementsService } from './statements.service';

@Module({
  providers: [StatementsService]
})
export class StatementsModule {}
