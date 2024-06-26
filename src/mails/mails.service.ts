import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  constructor(
    private mailService: MailerService,
    private readonly configService:ConfigService
  ) {}

  async sendUserConfirmation(user: string, email: string) {
    const url = this.configService.get<string>("frontend_url");
    await this.mailService.sendMail({
      to: email,
      subject: 'Bienvenido a POS',

      template: './welcome1',
      context: {
        name: user,
        url,
      },
    });
  }

  async sendInvitacion(
    user: string,
    email: string,
    name_empresa: string,
    url: string,
  ) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Invitacion a Nuestro Equipo',
      template: './invitacion',
      context: {
        name: user,
        url,
        name_empresa,
      },
    });
  }

  async sendCredencialesUser(
    user: string,
    email: string,
    name_empresa: string,
    url: string,
    contraseña: string,
  ) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Credenciales de Usuario',
      template: './user_credentials',
      context: {
        name: user,
        url,
        name_empresa,
        contraseña,
        email,
      },
    });
  }

  async sendCredencialesCliente(
    user: string,
    email: string,
    membresia: string,
    url: string,
    contraseña: string,
  ) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Compra Sistema POINTSALE',
      template: './compra_membresia',
      context: {
        name: user,
        url,
        membresia,
        contraseña,
        email,
      },
    });
  }
  
  async sendFactura(
    email: string,
    nombre_tienda: string,
    file: Express.Multer.File,
  ) {
    await this.mailService.sendMail({
      to: email,
      subject: '¡Gracias por tu compra! Aquí tienes tu factura',
      template: './factura', // asegúrate de que este archivo de plantilla exista
      context: {
        nombre_tienda,
      },
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: 'application/pdf',
          cid: 'factura_pdf', // para referenciar en el cuerpo del correo
        },
      ],
    });
  }

}
