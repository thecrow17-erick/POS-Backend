import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailService: MailerService) {}

  async sendUserConfirmation(user: string, email: string) {
    const url = `https://www.youtube.com/watch?v=L4tCfUbicfo`;
    console.log('entra');
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


}
