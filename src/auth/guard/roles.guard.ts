import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
    console.log(permissions)
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.UserId;
    const tenantId = req.tenantId;
    const findRolMember = await this.prisma.rol.findMany({
      where:{
        members:{
          every:{
            member:{
              userId,
              tenantId
            }
          }
        },
      },
    })

    if(!findRolMember.length)
      throw new UnauthorizedException("the user does not belong to the tenant")

    let isValid: Boolean = false;
    for (const rol of findRolMember) {
      const findPermission = await this.prisma.rolePermission.findMany({
        where:{
          rolId: rol.id,
          permission:{
            OR: permissions.map( p => ({
              desc: p
            }))
          }
        },
        select:{
          rol: true,
          permission: true
        }
      })
      console.log(findPermission)
      console.log(findPermission.length,permissions.length)

      if(findPermission.length == permissions.length)
        isValid=true;

    }
    if(isValid){
      return true
    }

    throw new UnauthorizedException("Role is not valid")
  } 
}
