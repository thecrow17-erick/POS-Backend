import { Module } from '@nestjs/common';
import { AuthController } from './controller';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports : [
    PrismaModule,
    UsersModule, 
    JwtModule,
    ConfigModule
  ]
})
export class AuthModule {}
