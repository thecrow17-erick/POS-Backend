import { Module } from '@nestjs/common';
import { AzureConnectionService } from './azure-connection.service';
import { AzureConnectionController } from './azure-connection.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AzureConnectionController],
  providers: [AzureConnectionService],
  imports:[
    ConfigModule
  ],
  exports:[
    AzureConnectionService
  ]
})
export class AzureConnectionModule {}
