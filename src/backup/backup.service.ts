import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AzureConnectionService } from 'src/azure-connection/azure-connection.service';

@Injectable()
export class BackupService {

  constructor(private readonly azureService: AzureConnectionService) {}


  @Cron('0 0 1 */3 *')
  async executeBackup():Promise<void>  {
    try {
      // Llama al método de AzureConnectionService para crear el respaldo y subirlo a Azure Blob Storage
      await this.azureService.createBackupAndUpload();
      console.log('Backup y subida a Azure Blob Storage completados.');
    } catch (error) {
      console.error('Error al realizar el backup y subirlo a Azure Blob Storage:', error);
      throw error;
    }
  }

}
