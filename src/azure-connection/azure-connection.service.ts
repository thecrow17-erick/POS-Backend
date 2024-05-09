import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

@Injectable()
export class AzureConnectionService {
  azureConnection = 'clave de acceso';
  container = 'nombre del contenedor';

  getHello(): string {
    return 'Hello World!';
  }

  getBlockBlobClient(filename: string): BlockBlobClient {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const blobContainer = blobServiceClient.getContainerClient(this.container);
    return blobContainer.getBlockBlobClient(filename);
  }

  async uploadImage(file: Express.Multer.File) {
    const blockBlobClient = this.getBlockBlobClient(file.originalname);
    await blockBlobClient.uploadData(file.buffer);
  }

  async visualizarImage(filename: string) {
    const blockBlobClient = this.getBlockBlobClient(filename);
    const blobDownload = await blockBlobClient.download(0);
    return blobDownload.readableStreamBody;
  }

  async getImageUrl(filename: string): Promise<string> {
    const blockBlobClient = this.getBlockBlobClient(filename);
    // Obtener la URL del blob
    const blobUrl = blockBlobClient.url;
    return blobUrl;
  }

  async deleteImage(filename: string) {
    const blockBlobClient = this.getBlockBlobClient(filename);
    await blockBlobClient.deleteIfExists();
  }
}
