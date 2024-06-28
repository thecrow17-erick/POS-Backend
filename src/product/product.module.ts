import { Module } from '@nestjs/common';
import { ProductController,BranchController } from './controllers';
import { ProductService } from './services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AzureConnectionModule } from 'src/azure-connection/azure-connection.module';
import { PrismaModule } from 'src/prisma';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';
import { BranchModule } from 'src/branch/branch.module';
import { BranchProductService } from './services/branch-product.service';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ProductController, BranchController],
  providers: [ProductService, BranchProductService],
  imports:[
    NestjsFormDataModule,
    AzureConnectionModule,
    PrismaModule,
    UsersModule,
    LogModule,
    BranchModule,
    CategoryModule
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule {}
