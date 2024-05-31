import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionRoleTenant } from '../interface';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
  ){}

  async allTenantRoles({
    where,
    orderBy,
    skip,
    take,
    select,
  }:IOptionRoleTenant){
    try {
      const allMembers = await this.prisma.rol.findMany({
        where,
        orderBy,
        skip,
        take,
        select
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async countTenantRoles({where}:IOptionRoleTenant){
    try {
      const allMembers = await this.prisma.rol.count({
        where
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

}
