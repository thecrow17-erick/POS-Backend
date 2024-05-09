import { Module } from '@nestjs/common';
import { SuscriptionController } from './controller/suscription.controller';
import { SuscriptionService } from './service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SuscriptionController],
  providers: [SuscriptionService],
  imports: [
    PrismaModule
  ]
})
export class SuscriptionModule {
}
