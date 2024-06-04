import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { MailsModule } from 'src/mails/mails.module';
import { PrismaModule } from 'src/prisma';

import { 
  UserRoleService,
  InvitationService,
  RoleService,
  TenantService,
  UsersService,
} from './service';
import { 
  InvitationController,
  RoleController,
  TenantController,
  UsersController,
  UserRoleController
} from './controller';

@Module({
  controllers: [UsersController, TenantController, RoleController, InvitationController, UserRoleController],
  providers: [UsersController, UsersService, TenantService, RoleService, InvitationService, UserRoleService],
  imports: [
    PrismaModule,
    NestjsFormDataModule,
    MailsModule,
    ScheduleModule,
    ConfigModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
