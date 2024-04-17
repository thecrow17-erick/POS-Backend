import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from 'src/prisma';
import { ConfigModule } from '@nestjs/config';
import { NodemailersModule } from 'src/nodemailers/nodemailers.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [
    PrismaModule,
    ConfigModule,
    NodemailersModule
  ]
})
export class EmployeeModule {}
