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
import { InvitationController } from './controller/invitation.controller';
import { InvitationService } from './service/invitation.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsersController, TenantController, RoleController, InvitationController],
  providers: [UsersController, UsersService, TenantService, RoleService, InvitationService],
  imports: [
    PrismaModule,
    NestjsFormDataModule,
    MailsModule,
    ScheduleModule,
    ConfigModule
  ],
  exports: [UsersService],
})
export class UsersModule {}
