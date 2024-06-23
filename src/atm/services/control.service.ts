import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BodyControlDto } from '../dto/body-control.dto';
import { AtmService } from '../services';
import { PrismaService } from 'src/prisma';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class ControlService {

  constructor(
    private readonly atmService: AtmService,
    private readonly prisma: PrismaService,
    private readonly logService: LogService
  ){}


  async open(bodyControlDto :BodyControlDto, userId: string){
    try {
      //ahora pregunto si existe el atm
      const findAtm = await this.atmService.findOne(bodyControlDto.atmId,{});
      //ahora si lo creo
      const openAtm = await this.prisma.controlATM.create({
        data:{
          employeeId: userId,
          monto: bodyControlDto.monto,
          atmId: bodyControlDto.atmId,
          type: "APERTURA"
        }
      })
      await this.prisma.atm.update({
        where:{
          id: findAtm.id,
        },
        data:{
          active: false
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} abrio la caja ${bodyControlDto.atmId}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: findAtm.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.10.2.10",
        message: "apertura de caja",
        username: userId
      })
      return openAtm;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
      
    }
  }

  async close(bodyControlDto :BodyControlDto, userId: string){
    try {
      //ahora pregunto si existe el atm
      const findAtm = await this.atmService.findOne(bodyControlDto.atmId,{});
      //ahora si lo creo
      const openAtm = await this.prisma.controlATM.create({
        data:{
          employeeId: userId,
          monto: bodyControlDto.monto,
          atmId: bodyControlDto.atmId,
          type: "CIERRE"
        }
      })

      await this.prisma.atm.update({
        where:{
          id: findAtm.id,
        },
        data:{
          active: true
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} cerro la caja ${bodyControlDto.atmId}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: findAtm.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.10.2.10",
        message: "cierre de caja",
        username: userId
      })
      return openAtm;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
      
    }
  }

}
