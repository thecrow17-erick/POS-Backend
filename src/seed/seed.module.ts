import { Module } from '@nestjs/common';
import { SeedService } from './service'
import { SeedController } from './controller';
import { PrismaModule, PrismaService } from 'src/prisma';

@Module({
  providers: [SeedService],
  controllers: [SeedController],
  imports: [
    PrismaModule
  ],
  exports:[
    SeedService
  ]
})
export class SeedModule {}
