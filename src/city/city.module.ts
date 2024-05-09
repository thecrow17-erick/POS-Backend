import { Module } from '@nestjs/common';
import { CityService } from './services';
import { CityController } from './controllers';
import { PrismaModule } from 'src/prisma';

@Module({
  controllers: [CityController],
  providers: [CityService],
  imports: [
    PrismaModule
  ],
  exports: [
    CityService
  ]
})
export class CityModule {}
