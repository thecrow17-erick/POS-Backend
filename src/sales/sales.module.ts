import { Module } from '@nestjs/common';
import { InventoryController } from './controllers';
import { ProductModule } from 'src/product/product.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma';
import { InventoryService } from './services';

@Module({
  controllers: [InventoryController],
  imports: [
    ProductModule,
    UsersModule,
    PrismaModule
  ],
  providers: [InventoryService]
})
export class SalesModule {}
