import { Module } from '@nestjs/common';
import { LogService } from './service/log.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [LogService],
  imports: [
    ConfigModule
  ],
  exports: [
    LogService
  ]
})
export class LogModule {}
