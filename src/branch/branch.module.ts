import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { PrismaModule } from 'src/prisma';
import { CityModule } from 'src/city/city.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [
    PrismaModule,
    CityModule
  ]
})
export class BranchModule {}
