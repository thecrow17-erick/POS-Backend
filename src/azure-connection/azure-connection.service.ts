import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import * as util from 'util';
import { container, responseFiles } from 'src/constants';

@Injectable()
export class AzureConnectionService {
  private readonly container = 'backup';
  constructor(
    private readonly configService: ConfigService
  ){}

  getBlockBlobClient(filename: string,containerName: keyof typeof container): BlockBlobClient {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.configService.get<string>("conection_string_storage")
    );
    const blobContainer = blobServiceClient.getContainerClient(containerName);
    return blobContainer.getBlockBlobClient(filename);
  }
  

  async uploadImage(file: Buffer, name: string,containerName: keyof typeof container):Promise<keyof typeof responseFiles>{
    try {
      const blockBlobClient = this.getBlockBlobClient(name,containerName);
      const uploada = await blockBlobClient.uploadData(file.buffer);
      const statusUpload = uploada._response.status;
      if(statusUpload >= 200 && statusUpload < 300 ){
        return "sucess"
      }
      return "error"
    } catch (err) {
      console.log(err);
      return "error"
    }
  }

  async visualizarImage(filename: string,containerName: keyof typeof container) {
    const blockBlobClient = this.getBlockBlobClient(filename,containerName);
    const blobDownload = await blockBlobClient.download(0);
    return blobDownload.readableStreamBody;
  }

  async getImageUrl(filename: string,containerName: keyof typeof container): Promise<string | keyof typeof responseFiles> {
    try {
      const blockBlobClient = this.getBlockBlobClient(filename,containerName);
      // Obtener la URL del blob
      const blobUrl = blockBlobClient.url;
      return blobUrl;
    }catch (err) {
      return "error"
    }
  }

  async deleteImage(filename: string,containerName: keyof typeof container) :Promise<keyof typeof responseFiles>{
    try {
      const blockBlobClient = this.getBlockBlobClient(filename,containerName);
      await blockBlobClient.deleteIfExists();
      return "sucess"
    } catch (err) {
      console.log(err);
      return "error"
    }
  }
  async createBackupAndUpload(): Promise<void> {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, '-');
    const backupFileName = `${formattedDate}.dump`;

    console.log(backupFileName)
    const pgDumpCommand = `pg_dump -U ${this.configService.get<string>("DB_USER")} -d ${this.configService.get<string>("DB_NAME")} -h ${this.configService.get<string>("DB_HOST")} -w -Fc`; 

    console.log(pgDumpCommand)
    // const pgDumpCommand = `pg_dump -U ${this.configService.get<string>("DB_USER")} -d ${this.configService.get<string>("DB_NAME")} -f ${backupFileName} -w -Fc`;

    // Ejecutar el comando usando util.promisify
    const execPromise = util.promisify(exec);
    try {
      const { stdout } = await execPromise(pgDumpCommand,{
        env:{
          PGPASSWORD:this.configService.get<string>("DB_PASSWORD")
        }
      });

      // Crear el cliente de BlobService y obtener el cliente de Blob
      const blockBlobClient = this.getBlockBlobClient(backupFileName,"backup");

      // Convertir stdout (string) a un ArrayBuffer
      const content = Buffer.from(stdout, 'utf8').buffer;

      // Subir los datos directamente al Blob
      await blockBlobClient.uploadData(content);

      console.log('Backup de la base de datos y subida a Azure Blob Storage completados.');
    } catch (error) {
      console.error('Error al realizar el backup y subirlo a Azure Blob Storage:', error);
      throw error;
    }
  }
}
