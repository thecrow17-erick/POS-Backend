import { Module } from '@nestjs/common';
import { CategoryController } from './controllers';
import { CategoryService } from './services/category.service';
import { PrismaModule } from 'src/prisma';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { LogModule } from 'src/log/log.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    PrismaModule,
    UsersModule,
    LogModule
  ]
})
export class CategoryModule {}
