import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionUserRole } from '../interface';
import { AsignInvitationDto } from '../dto';
import { RoleService } from './role.service';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class UserRoleService {

  constructor(
    private readonly prisma:PrismaService,
    private readonly roleService:RoleService,
    private readonly logService:LogService
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

  async updateUserRole(tenantId:number,userId:string,memberId:number,asignInvitationDto:AsignInvitationDto){
    try {
      const findMember = await this.findByIdMember(tenantId,memberId);
      const role = await this.roleService.findRoleId(asignInvitationDto.rolId, tenantId);
      const updateMemberRol = await this.prisma.memberTenant.update({
        where: {
          id: findMember.id
        },
        data:{
          rolId: role.id
        }
      });
      this.logService.log({
        accion: `el usuario ${userId} actualizo el rol del miembro ${updateMemberRol.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Actualizar rol de miembro`,
        username: userId
      })
      return updateMemberRol;

    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }
  
  async findByIdMember(tenantId:number,memberId:number){
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
        },
        select:{
          rol: true,
          tenant: true,
          id: true,
          user: true,
          createdAt: true,
          updatedAt: true
        }
      });
      if(!findMember)
        throw new NotFoundException("miembro no encontrado")
      
      return findMember;

    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }

  }

}
