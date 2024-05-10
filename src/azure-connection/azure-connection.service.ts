import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { container, responseFiles } from 'src/constants';

@Injectable()
export class AzureConnectionService {

  constructor(
    private readonly configService: ConfigService
  ){}

  getHello(): string {
    return 'Hello World!';
  }

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
}
