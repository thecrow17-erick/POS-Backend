import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailsService } from './mails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailsController } from './mails.controller';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config:ConfigService) => ({
        transport: {
          host: config.get<string>("host_email"),
          secure: false,
          auth: {
            user: config.get<string>("account_email"),
            pass: config.get<string>("password_email"),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>('account_email')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  providers: [MailsService],
  exports: [MailsService],
  controllers: [MailsController],
})
export class MailsModule {}