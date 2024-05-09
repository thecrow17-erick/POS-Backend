import { Module } from '@nestjs/common';
import { BranchService } from './services';
import { BranchController } from './controllers';
import { PrismaModule } from 'src/prisma';
import { CityModule } from 'src/city/city.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [
    PrismaModule,
    CityModule
  ],
  exports: [
    BranchService
  ]
})
export class BranchModule {}
