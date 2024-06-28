import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CORS } from './constants';
import * as schedule from 'node-schedule';
import { BackupService } from './backup/backup.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");  
  const backupService = app.get(BackupService);
  await backupService.executeBackup();
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

  await app.listen(process.env.PORT, ()=>{
    console.log(`Server on port ${process.env.PORT}`);
  });
}
bootstrap();
