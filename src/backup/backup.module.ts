import { Module } from '@nestjs/common';
import { BackupController } from './controllers';
import { BackupService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [BackupController],
  providers: [BackupService],
  imports:[
    ConfigModule
  ]
})
export class BackupModule {}
