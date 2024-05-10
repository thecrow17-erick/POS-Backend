import { Module } from '@nestjs/common';
import { UsersController } from './controller';
import { UsersService } from './service';
import { PrismaModule } from 'src/prisma';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  controllers: [UsersController],
  providers: [UsersController, UsersService],
  imports: [
    PrismaModule,
    NestjsFormDataModule,
    MailsModule
  ],
  exports: [UsersService],
})
export class UsersModule {}
