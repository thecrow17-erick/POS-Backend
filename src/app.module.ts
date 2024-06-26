import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig, EnvSchema } from './config';
import { CommonModule } from './common/common.module';
import { BranchModule } from './branch/branch.module';
import { CityModule } from './city/city.module';
import { AtmModule } from './atm/atm.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { SuscriptionModule } from './suscription/suscription.module';
import { MailsModule } from './mails/mails.module';
import { AzureConnectionModule } from './azure-connection/azure-connection.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ProviderModule } from './provider/provider.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LogModule } from './log/log.module';
import { SalesModule } from './sales/sales.module';
import { BuysModule } from './buys/buys.module';
import { PrinterModule } from './printer/printer.module';
import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: EnvSchema,
      isGlobal: true,
    }),
    NestjsFormDataModule.configAsync({
      useFactory: ()=>({
        storage: FileSystemStoredFile,
        fileSystemStoragePath: '/tmp',
      }),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule, 
    CommonModule, 
    BranchModule, 
    CityModule, 
    AtmModule, 
    UsersModule, 
    AuthModule, 
    SeedModule,
    MailsModule,
    AzureConnectionModule,
    SuscriptionModule,
    MailsModule,
    AzureConnectionModule,
    CategoryModule,
    ProductModule,
    ProviderModule,
    LogModule,
    SalesModule,
    BuysModule,
    PrinterModule,
    ReportsModule,
  ],
  providers: [],
})
export class AppModule {}
