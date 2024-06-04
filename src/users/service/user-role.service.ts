import { Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionUserRole } from '../interface';
import { TenantGuard } from 'src/auth/guard';
import { AuthService } from 'src/auth/service';

@Injectable()
@UseGuards(TenantGuard,AuthService)
export class UserRoleService {

  constructor(
    private readonly prisma:PrismaService
  ){}


  async allUserRole({
    skip,
    take,
    where,
    orderBy,
    select
  }:IOptionUserRole
  ){
    try {
      const allInvitation = await this.prisma.memberTenant.findMany({
        where,
        take,
        skip,
        select,
        orderBy
      })      
      return allInvitation;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async countUserRole({
    where
  }:IOptionUserRole
  ){
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
