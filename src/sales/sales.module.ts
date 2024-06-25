import { Module } from '@nestjs/common';
import { InventoryController } from './controllers/product.controller';
import { ProductModule } from 'src/product/product.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma';
import { InventoryService } from './services/inventory.service';

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
