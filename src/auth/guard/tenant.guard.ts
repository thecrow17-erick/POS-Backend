import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService
  ){}
  
  async canActivate(
    context: ExecutionContext,
  ){
    const req = context.switchToHttp().getRequest<Request>();

    const subdomain = req.headers["subdomain"]

    if(!subdomain || Array.isArray(subdomain)) 
      throw new UnauthorizedException("subdomain in not domain");

    const isSubdomain = await this.prisma.tenant.findFirst({
      where:{
        hosting: subdomain
      }
    });
    if(!isSubdomain)
      throw new BadRequestException(`${subdomain} not found`)

    req.tenantId = isSubdomain.id;
    return true;
  }
}
