import {
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AzureConnectionService } from './azure-connection.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('azure-connection')
export class AzureConnectionController {
  constructor(
    private readonly azureConnectionService: AzureConnectionService,
  ) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageAzure(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'No se proporcionó ningún archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.azureConnectionService.uploadImage(file.buffer,"dfasasdasd.png","imagenes");
    return 'Imagen Subida';
  }

  @Get('ver-image')
  @Header('Content-Type', 'image/webp')
  async visualizarImageAzure(@Res() res, @Query('name') name) {
    if (!name) {
      throw new HttpException(
        'El parámetro "name" es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.azureConnectionService.visualizarImage(name,"imagenes");
    return data.pipe(res);
  }

  @Get('get-image-url')
  async getImageUrl(@Query('filename') filename: string): Promise<string> {
    if (!filename) {
      throw new HttpException(
        'El parámetro "filename" es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }
    const blobUrl = await this.azureConnectionService.getImageUrl(filename,"imagenes");
    return blobUrl;
  }

  @Get('download-Image')
  async downloadImage(
    @Query('filename') filename: string,
    @Res() res,
  ): Promise<void> {
    const readableStream = await this.azureConnectionService.visualizarImage(
      filename,
      "imagenes"
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`); // Establece el nombre del archivo para descargar
    res.setHeader('Content-Type', 'image/jpeg'); // Establece el tipo de contenido de la respuesta (puedes ajustarlo según el tipo de imagen que estás descargando)
    readableStream.pipe(res); // Envía la imagen como una respuesta
  }

  @Delete('delete-image')
  async deleteImageAzure(@Query('filename') filename: string) {
    if (!filename) {
      throw new HttpException(
        'El parámetro "filename" es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.azureConnectionService.deleteImage(filename,"imagenes");
    return 'Imagen Eliminada';
  }
}
