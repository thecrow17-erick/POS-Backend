import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionUserRole } from '../interface';
import { TenantGuard } from 'src/auth/guard';
import { AuthService } from 'src/auth/service';
import { AsignInvitationDto } from '../dto';
import { RoleService } from './role.service';

@Injectable()
export class UserRoleService {

  constructor(
    private readonly prisma:PrismaService,
    private readonly roleService:RoleService
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

  async updateUserRole(tenantId:number,memberId:number,asignInvitationDto:AsignInvitationDto){
    try {
      const findMember = await this.prisma.memberTenant.findFirst({
        where:{
          AND: [
            {
              tenantId
            },
            {
              id: memberId
            }
          ]
        }
      })
      if(!findMember)
        throw new BadRequestException("miembro no encontrado")

      const role = await this.roleService.findRoleId(asignInvitationDto.rolId, tenantId);
      const updateMemberRol = await this.prisma.memberTenant.update({
        where: {
          id: findMember.id
        },
        data:{
          rolId: role.id
        }
      });

      return updateMemberRol;

    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }
  
}
