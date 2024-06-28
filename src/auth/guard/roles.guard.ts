import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!permissions) {
        return true;
    }
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.UserId;
    const tenantId = req.tenantId;
    const findRolMember = await this.prisma.memberTenant.findFirst({
      where:{
        AND:[
          {
            tenantId,
          },
          {
            userId
          }
        ]
      },
      select:{
        rol: true,
        user: true,
      }
    })
    if(!findRolMember)
      throw new UnauthorizedException("El usuario debe pertenecer a un area de trabajo")
    

    const findPermission = await this.prisma.permission.findMany({
      where:{
          OR: permissions.map ( p => ({desc: p}))
        }
      })
    
    if(findPermission.length !== permissions.length)
      throw new NotFoundException("no existen todos los permisos")
    
    
    const findPermissionRole = await this.prisma.rolePermission.findMany({
      where:{
        rolId: findRolMember.rol.id,
        permissionid:{
          in: findPermission.map(p => p.id)
        }
      },
      select:{
        permission: true,
        rol: true
      }
    }) 

    console.log(findPermissionRole)
    if(findPermissionRole.length === permissions.length)
      return true;

    throw new UnauthorizedException("El rol no tiene este permiso")
  } 
}
