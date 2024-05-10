import { Module } from '@nestjs/common';
import { ProviderController } from './controllers/provider.controller';
import { ProviderService } from './services/provider.service';
import { PrismaModule } from 'src/prisma';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  imports: [
    PrismaModule
  ]
})
export class ProviderModule {}
