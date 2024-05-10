import { Module } from '@nestjs/common';
import { CategoryController } from './controllers';
import { CategoryService } from './services/category.service';
import { PrismaModule } from 'src/prisma';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    PrismaModule
  ]
})
export class CategoryModule {}
