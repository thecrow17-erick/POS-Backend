import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CORS } from './constants';
import {BackupService} from 'src/backup/services';
import * as schedule from 'node-schedule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const backup = app.get(BackupService)
  app.setGlobalPrefix("api");  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions:{
        enableImplicitConversion: true
      }
    })
  );
  app.enableCors(CORS);
  //BACKUP 
  schedule.scheduleJob('0 20 17 * * *',backup.backup.bind(backup));

  await app.listen(process.env.PORT, ()=>{
    console.log(`Server on port ${process.env.PORT}`);
  });
}
bootstrap();
