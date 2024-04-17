import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IEmployeeCreate } from './interface';

@Injectable()
export class NodemailersService {
  constructor(
    private readonly mailerService: MailerService,
  ){}

  async sendMailEmployeeAtm(bodyEmployee: IEmployeeCreate){
    try {
      const mail = await this.mailerService.sendMail({
        to: bodyEmployee.email,
        from: ' "POS FICCT <erickaricari@gmail.com>',
        subject: "Codigo de empleado!",
        html:`
          <h1> Bienvenido a la empresa ${bodyEmployee.name}</h1>
          
          <p>Con este codigo de empleado trabajaras <span>${bodyEmployee.codigo}</span> </p>
        `
      })
  
      return mail;
      
    } catch (err) {
      throw new BadRequestException("Email bad request");
    }
  }

}
