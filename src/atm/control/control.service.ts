import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BodyControlDto } from './dto/body-control.dto';
import { AtmService } from '../atm.service';
import { PrismaService } from 'src/prisma';

@Injectable()
export class ControlService {

  constructor(
    private readonly atmService: AtmService,
    private readonly prisma: PrismaService
  ){}


  async open(bodyControlDto :BodyControlDto){
    try {
      // const employeeFind = await this.employeeService.findEmployeeAtm({
      //   where:{
      //     codeEmployee: bodyControlDto.employeeCode,
      //   }
      // });
      // if(!employeeFind) throw new NotFoundException("Employee not found")
      //ahora pregunto si existe el atm
      await this.atmService.findOne(bodyControlDto.atmId,{});
      //ahora si lo creo
      const openAtm = await this.prisma.controlATM.create({
        data:{
          employeeId: "dawawddqwaqwer",
          monto: bodyControlDto.monto,
          atmId: bodyControlDto.atmId,
          type: "Apertura"
        }
      })
      return openAtm;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
      
    }
  }

  async close(bodyControlDto :BodyControlDto){
    try {
      // const employeeFind = await this.employeeService.findEmployeeAtm({
      //   where:{
      //     codeEmployee: bodyControlDto.employeeCode,
      //   }
      // });
      // if(!employeeFind) throw new NotFoundException("Employee not found")
      //ahora pregunto si existe el atm
      await this.atmService.findOne(bodyControlDto.atmId,{});
      //ahora si lo creo
      const openAtm = await this.prisma.controlATM.create({
        data:{
          employeeId: "dasasdfasas",
          monto: bodyControlDto.monto,
          atmId: bodyControlDto.atmId,
          type: "Cierre"
        }
      })
      return openAtm;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
      
    }
  }

}
