import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { AzureConnectionModule } from 'src/azure-connection/azure-connection.module';

@Module({
  providers: [BackupService],
  imports: [
    AzureConnectionModule
  ]
})
export class BackupModule {}
