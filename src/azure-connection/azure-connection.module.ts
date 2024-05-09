import { Module } from '@nestjs/common';
import { AzureConnectionService } from './azure-connection.service';
import { AzureConnectionController } from './azure-connection.controller';

@Module({
  controllers: [AzureConnectionController],
  providers: [AzureConnectionService],
})
export class AzureConnectionModule {}
