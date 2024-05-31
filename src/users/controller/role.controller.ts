import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TenantGuard } from 'src/auth/guard';
import { IsAdminGuard } from 'src/auth/guard/is-admin.guard';
import { roles } from 'src/constants';
import { RoleService } from '../service/role.service';
import { QueryCommonDto } from 'src/common';

@Controller('role')
@UseGuards(TenantGuard,IsAdminGuard) 
export class RoleController {
  constructor(
    private readonly roleService: RoleService
  ){}

  @Get()
  @HttpCode(HttpStatus.OK)
  async allRoles(@Query() query: QueryCommonDto,  @Req() req: Request){
    const statusCode = HttpStatus.OK
    const tenantId = req.tenantId;
    const {limit,skip} = query;
    const roleAdmin: keyof typeof roles = "Administrador";
    const [total, totalroles] = await Promise.all([
      this.roleService.countTenantRoles({
        where:{
          tenantId,
          desc:{
            not: roleAdmin
          }
        }
      }),
      this.roleService.allTenantRoles({
        where:{
          desc:{
            not: roleAdmin
          },
          tenantId
        },
        skip,
        take: limit
      })
    ])
    const allRoles = totalroles.map(r =>({
      ...r,
      createdAt: r.createdAt.toLocaleString(),
      updatedAt: r.updatedAt.toLocaleString()
    }));

    return {
      statusCode,
      message: "all roles",
      data:{
        allRoles,
        total
      }
    }
  }

}
