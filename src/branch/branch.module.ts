import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [
    PrismaModule
  ]
})
export class BranchModule {}
