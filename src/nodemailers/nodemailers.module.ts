import { Module } from '@nestjs/common';
import { NodemailersService } from './nodemailers.service';
import {MailerModule} from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [NodemailersService],
  imports: [
    ConfigModule,
    MailerModule.forRoot({
      transport:{
        host: process.env.HOST_EMAIL,
        auth: {
          user: process.env.ACCOUNT_EMAIL,
          pass: process.env.PASSWORD_EMAIL
        }
      },
    })
  ],
  exports: [
    NodemailersService
  ]
})
export class NodemailersModule {}
