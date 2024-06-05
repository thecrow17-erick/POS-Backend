import { Module } from '@nestjs/common';
import { ProductController } from './controllers';
import { ProductService } from './services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AzureConnectionModule } from 'src/azure-connection/azure-connection.module';
import { PrismaModule } from 'src/prisma';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    NestjsFormDataModule,
    AzureConnectionModule,
    PrismaModule,
    UsersModule,
    LogModule
  ]
})
export class ProductModule {}
