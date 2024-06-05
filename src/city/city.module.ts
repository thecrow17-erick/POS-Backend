import { Module } from '@nestjs/common';
import { CityService } from './services';
import { CityController } from './controllers';
import { PrismaModule } from 'src/prisma';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';

@Module({
  controllers: [CityController],
  providers: [CityService],
  imports: [
    PrismaModule,
    UsersModule,
    LogModule
  ],
  exports: [
    CityService,
  ]
})
export class CityModule {}
