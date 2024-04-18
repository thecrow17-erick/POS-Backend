import { Module } from '@nestjs/common';
import { AtmService } from './atm.service';
import { AtmController } from './atm.controller';
import { PrismaModule } from 'src/prisma';
import { BranchModule } from 'src/branch/branch.module';
import { ControlController } from './control/control.controller';
import { ControlService } from './control/control.service';
import { EmployeeModule } from 'src/employee';

@Module({
  controllers: [AtmController, ControlController],
  providers: [AtmService, ControlService],
  imports: [
    PrismaModule,
    BranchModule,
    EmployeeModule
  ]
})
export class AtmModule {}
