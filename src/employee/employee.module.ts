import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaModule } from 'src/prisma';
import { ConfigModule } from '@nestjs/config';
import { NodemailersModule } from 'src/nodemailers/nodemailers.module';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [
    PrismaModule,
    ConfigModule,
    NodemailersModule,
    BranchModule
  ],
  exports: [
    EmployeeService
  ]
})
export class EmployeeModule {}
