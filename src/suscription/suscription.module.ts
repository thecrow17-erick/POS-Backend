import { Module } from '@nestjs/common';
import { SuscriptionController } from './controller/suscription.controller';
import { SuscriptionService } from './service';
import { PrismaModule } from '../prisma/prisma.module';
import { SeedModule } from 'src/seed/seed.module';
import { UsersModule } from 'src/users/users.module';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  controllers: [SuscriptionController],
  providers: [SuscriptionService],
  imports: [
    PrismaModule,
    SeedModule,
    UsersModule,
    MailsModule
  ]
})
export class SuscriptionModule {
}
