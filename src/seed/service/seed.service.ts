import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import {rolData, dataModule, dataPaymentMethod,dataSuscription} from '../data';
import { IPermissions } from '../interface';

@Injectable()
export class SeedService {

  constructor(
    private readonly prisma: PrismaService
  ){}

  async seedRol(){
    try{
      const roles = await this.prisma.rol.findMany({
        where: {
          OR: rolData
        }
      });
      if(roles.length > 0) throw new BadRequestException("The role seed is already inserted");

      const rolesCreate = await this.prisma.rol.createMany({
        data: rolData
      })

      return `${rolesCreate.count} roles Seed inserted correctly`

    }catch(err){
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }


  async seedModule(){
    try{
      const modules = await this.prisma.module.findMany({
        where: {
          OR: dataModule
        }
      });
      if(modules.length > 0) throw new BadRequestException("The modules seed is already inserted");

      const rolesCreate = await this.prisma.module.createMany({
        data: dataModule
      })

      return `${rolesCreate.count} modules Seed inserted correctly`

    }catch(err){
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async seedPermission(){
    try{
      const modules = await this.prisma.module.findMany();

      const roles = await this.prisma.rol.findMany();

      if(modules.length === 0 && roles.length === 0) 
        throw new BadRequestException("insert the seeds of roles and modules");

      const bodyPermission:IPermissions[] = [];

      roles.map (role => {
        modules.map(module =>
          bodyPermission.push({
          rolId:      role.id,
          moduleId:   module.id,
          get:        true,
          create:     true,
          edit:       true,
          delete:     true,
        }))
      })

      const permissions = await this.prisma.permission.createMany({
        data: bodyPermission
      })
      

      return `${permissions.count} permissions have been inserted`

    }catch(err){
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async seedPaymentMethod(){
    try{
      const payments = await this.prisma.paymentMethod.findMany({
        where: {
          OR: dataPaymentMethod
        }
      });
      if(payments.length > 0) throw new BadRequestException("The modules seed is already inserted");

      const rolesCreate = await this.prisma.paymentMethod.createMany({
        data: dataPaymentMethod
      })

      return `${rolesCreate.count} payment methods Seed inserted correctly`

    }catch(err){
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async seedSuscription(){
    try{
      const suscriptions = await this.prisma.suscription.findMany({
        where: {
          OR: dataSuscription
        }
      });
      if(suscriptions.length > 0) throw new BadRequestException("The modules seed is already inserted");

      const rolesCreate = await this.prisma.suscription.createMany({
        data: dataSuscription
      })

      return `${rolesCreate.count} suscriptions Seed inserted correctly`

    }catch(err){
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

}
