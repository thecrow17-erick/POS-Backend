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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      validationSchema: EnvSchema,
      isGlobal: true,
    }),
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
    SuscriptionModule
    MailsModule,
    AzureConnectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
