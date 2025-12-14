import { Module } from '@nestjs/common';
import { FundsService } from './funds.service';
import { FundsController } from './funds.controller';

@Module({
  providers: [FundsService],
  controllers: [FundsController]
})
export class FundsModule {}
