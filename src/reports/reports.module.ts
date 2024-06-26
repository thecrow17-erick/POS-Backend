import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  providers: [ReportsService],
  imports: [
    PrinterModule
  ],
  exports: [
    ReportsService
  ]
})
export class ReportsModule {}
