import { Module } from '@nestjs/common';
import { ProviderController } from './controllers/provider.controller';
import { ProviderService } from './services/provider.service';
import { PrismaModule } from 'src/prisma';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  imports: [
    PrismaModule,
    UsersModule
  ]
})
export class ProviderModule {}
