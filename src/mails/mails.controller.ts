import { Controller, Post, Body } from '@nestjs/common';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private readonly mailsService: MailsService) {}

  @Post('sendBienvenida')
  async createEmail(@Body('user') user: string, @Body('email') email: string) {
    return await this.mailsService.sendUserConfirmation(user, email);
  }

  @Post('sendInvitacion')
  async createEmailInvitacion(
    @Body('user') user: string,
    @Body('email') email: string,
    @Body('name_empresa') name_empresa: string,
    @Body('url') url: string,
  ) {
    return await this.mailsService.sendInvitacion(
      user,
      email,
      name_empresa,
      url,
    );
  }

  @Post('sendCredentialesUser')
  async createCredencialesUser(
    @Body('user') user: string,
    @Body('email') email: string,
    @Body('name_empresa') name_empresa: string,
    @Body('url') url: string,
    @Body('contraseña') contraseña: string,
  ) {
    return await this.mailsService.sendCredencialesUser(
      user,
      email,
      name_empresa,
      url,
      contraseña,
    );
  }

  @Post('sendCredentialesCliente')
  async createCredencialesCliente(
    @Body('user') user: string,
    @Body('email') email: string,
    @Body('membresia') membresia: string,
    @Body('url') url: string,
    @Body('contraseña') contraseña: string,
  ) {
    return await this.mailsService.sendCredencialesCliente(
      user,
      email,
      membresia,
      url,
      contraseña,
    );
  }
}
