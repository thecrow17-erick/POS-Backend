import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionPermission, IOptionRoleTenant } from '../interface';
import { CreateRolDto } from '../dto';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService:LogService
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

  async allPermission({
    where,
    orderBy,
    skip,
    take,
    select
  }:IOptionPermission){
    try {
      const allMembers = await this.prisma.permission.findMany({
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

  async countPermission({where}:IOptionPermission){
    try {
      const allMembers = await this.prisma.permission.count({
        where
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async findRole({where}:IOptionRoleTenant){
    try {
      const allMembers = await this.prisma.rol.findFirst({
        where
      })  
      return allMembers;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async findRoleId(id: number, tenantId:number){
    try {
      const roleId = await this.prisma.rol.findUnique({
        where:{
          id,
          tenantId
        }
      });
      if(!roleId)
        throw new NotFoundException(`rol id ${id} not found`)

      return roleId;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async createRol(tenantId:number,userId:string, createRolDto: CreateRolDto){
    try {
      const findRole = await this.findRole({
        where:{
          desc: createRolDto.desc,
          tenantId
        }
      });
      if(findRole)
        throw new BadRequestException("role in used")
      
      const findPermissions = await this.allPermission({
        where:{
          OR: createRolDto.permissions.map(p => ({
            id: p,
          }))
        }
      });
      if(findPermissions.length !== createRolDto.permissions.length)
        throw new BadRequestException("enter valid permissions");

      const rolCreate = await this.prisma.rol.create({
        data: {
          desc: createRolDto.desc,
          tenantId
        }
      })
      const permissionRole = await this.prisma.rolePermission.createMany({
        data:findPermissions.map(p =>({
          rolId: rolCreate.id,
          permissionid: p.id
        }))
      })
      this.logService.log({
        accion: `el usuario ${userId} creo el rol ${rolCreate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Crear rol`,
        username: userId
      })
      return{
        rolCreate,
        permission: `${permissionRole.count} permissions assigned to the role`
      }

    } catch (err) {

      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async deleteRol(id: number, userId:string,tenantId:number){
    try {
      const roleId = await this.findRoleId(id,tenantId);
      
      const roleDelete = await this.prisma.rol.update({
        where:{
          id: roleId.id
        },
        data:{
          status: !roleId.status
        }
      }) 

      this.logService.log({
        accion: `el usuario ${userId} ${roleDelete.status? "activo":"desactivo"} el rol ${roleDelete.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `${roleDelete.status? "Activar":"Desactivar"} rol`,
        username: userId
      })
      return roleDelete;
      
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

}
