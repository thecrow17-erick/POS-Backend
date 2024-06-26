import { Module } from '@nestjs/common';
import { ProviderController } from './controllers/provider.controller';
import { ProviderService } from './services/provider.service';
import { PrismaModule } from 'src/prisma';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  imports: [
    PrismaModule,
    UsersModule,
    LogModule
  ],
  exports: [
    ProviderService
  ]
})
export class ProviderModule {}
