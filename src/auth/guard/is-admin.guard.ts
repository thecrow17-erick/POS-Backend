import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { roles } from 'src/constants';
import { PrismaService } from 'src/prisma';
import { useToken } from 'src/utils';

@Injectable()
export class IsAdminGuard implements CanActivate {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const token = req.headers["service-token"]
    if(!token || Array.isArray(token)) 
      throw new UnauthorizedException("token is invalid");

    const manageToken = useToken(token);

    if(typeof manageToken === "string")
      throw new UnauthorizedException(manageToken);

    if(manageToken.isExpired)
      throw new UnauthorizedException('Token expired');

    const roleAdmin: keyof typeof roles = "Administrador";
    
    const findUser = await this.prisma.memberTenant.findFirst({
      where: {
        userId: manageToken.userId
      }
    })
    if(!findUser)
      throw new UnauthorizedException("user not found")

    const findIsAdmin = await this.prisma.memberRole.findFirst({
      where:{
        memberId: findUser.id,
        rol: {
          desc: roleAdmin,
          tenantId: req.tenantId
        }
      }
    });
    if(!findIsAdmin)  
      throw new UnauthorizedException("user is not admin")

    req.UserId = findUser.userId;
    return true;
  }
}
