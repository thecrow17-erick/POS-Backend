import { Module } from '@nestjs/common';
import { BranchService } from './services';
import { BranchController } from './controllers';
import { PrismaModule } from 'src/prisma';
import { CityModule } from 'src/city/city.module';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [
    PrismaModule,
    CityModule,
    UsersModule,
    LogModule
  ],
  exports: [
    BranchService
  ]
})
export class BranchModule {}
