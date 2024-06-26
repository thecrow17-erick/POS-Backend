import { Module } from '@nestjs/common';
import { InventoryController } from './controllers';
import { ProductModule } from 'src/product/product.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma';
import { InventoryService } from './services';
import { SalesService } from './services/sales.service';
import { SalesController } from './controllers/sales.controller';
import { BranchModule } from 'src/branch/branch.module';
import { AtmModule } from 'src/atm/atm.module';
import { ReportsModule } from '../reports/reports.module';
import { MailsModule } from 'src/mails/mails.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [InventoryController, SalesController],
  imports: [
    MailsModule,
    ProductModule,
    PrismaModule,
    BranchModule,
    UsersModule,
    AtmModule,
    ReportsModule,
  ],
  providers: [InventoryService, SalesService]
})
export class SalesModule {}
