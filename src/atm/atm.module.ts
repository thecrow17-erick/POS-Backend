import { Module } from '@nestjs/common';
import { AtmService } from './atm.service';
import { AtmController } from './atm.controller';
import { PrismaModule } from 'src/prisma';
import { BranchModule } from 'src/branch/branch.module';

@Module({
  controllers: [AtmController],
  providers: [AtmService],
  imports: [
    PrismaModule,
    BranchModule
  ]
})
export class AtmModule {}
