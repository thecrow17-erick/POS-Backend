import { Module } from '@nestjs/common';
import { UsersController } from './controller';
import { UsersService } from './service';
import { PrismaModule } from 'src/prisma';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MailsModule } from 'src/mails/mails.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TenantController } from './controller/tenant.controller';
import { TenantService } from './service/tenant.service';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';

@Module({
  controllers: [UsersController, TenantController, RoleController],
  providers: [UsersController, UsersService, TenantService, RoleService],
  imports: [
    PrismaModule,
    NestjsFormDataModule,
    MailsModule,
    ScheduleModule
  ],
  exports: [UsersService],
})
export class UsersModule {}
