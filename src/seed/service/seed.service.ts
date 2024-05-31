import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import {permissionData ,dataSuscription} from '../data';

@Injectable()
export class SeedService {

  constructor(
    private readonly prisma: PrismaService
  ){}

  async seedPermission(){
    try{
      const findPermissions = await this.prisma.permission.findMany({
          where:{
            OR: permissionData
          }
        })
      if(findPermissions.length > 0)
        throw new BadRequestException("permission seed is already inserted")

      const permissionCreate = await this.prisma.permission.createMany({
        data: permissionData
      })

      return `${permissionCreate.count} permissions seed inserted correctly`

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
