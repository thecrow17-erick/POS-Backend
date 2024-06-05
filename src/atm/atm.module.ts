import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { BranchModule } from 'src/branch/branch.module';
import { ControlController, AtmController } from './controller';
import { ControlService,AtmService } from './services';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AtmController, ControlController],
  providers: [AtmService, ControlService],
  imports: [
    PrismaModule,
    BranchModule,
    UsersModule
  ]
})
export class AtmModule {}
