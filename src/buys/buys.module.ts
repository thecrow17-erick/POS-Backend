import { Module } from '@nestjs/common';
import { BuysController } from './controllers';
import { ProductModule } from 'src/product/product.module';
import { ProviderModule } from 'src/provider/provider.module';
import { PrismaModule } from 'src/prisma';
import { BranchModule } from 'src/branch/branch.module';
import { UsersModule } from 'src/users/users.module';
import { BuysService } from './services';

@Module({
  controllers: [BuysController],
  imports: [
    ProductModule,
    ProviderModule,
    PrismaModule,
    BranchModule,
    UsersModule
  ],
  providers: [BuysService]
})
export class BuysModule {}
