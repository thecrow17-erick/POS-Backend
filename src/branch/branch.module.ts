import { Module } from '@nestjs/common';
import { BranchService } from './services';
import { BranchController } from './controllers';
import { PrismaModule } from 'src/prisma';
import { CityModule } from 'src/city/city.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [
    PrismaModule,
    CityModule,
    UsersModule
  ],
  exports: [
    BranchService
  ]
})
export class BranchModule {}
