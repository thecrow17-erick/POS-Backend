import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {IOptionMemberTenant} from '../interface';


@Injectable()
export class TenantService {
  constructor(
    private readonly prisma: PrismaService

  ){}

  async getAllTenants({
    skip,
    take,
    where,
    select,
    orderBy,
  }:IOptionMemberTenant){
    try {
      const allMembers = await this.prisma.memberTenant.findMany({
        skip,
        take,
        where,
        select,
        orderBy
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async countTenants({
    where,
  }:IOptionMemberTenant){
    try {
      const allMembers = await this.prisma.memberTenant.count({
        where
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }



}
