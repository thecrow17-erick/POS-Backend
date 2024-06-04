import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { AuthSaasGuard, TenantGuard } from 'src/auth/guard';
import { TenantService } from '../service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';

@Controller('tenant')
export class TenantController {

  constructor(
    private readonly tenantService: TenantService,
  ){}

  @Get('user')
  @UseGuards(AuthSaasGuard)
  @HttpCode(HttpStatus.OK)
  async usersTenants(@Query() query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const {limit,skip} = query;
    const userId = req.UserId;
    const [tenants, total] = await Promise.all([
      this.tenantService.getAllTenants({
        skip,
        take: limit,
        where:{
          userId,
        },
        select:{
          rol: {
            select:{
              id: true,
              desc: true,
            }
          },
          tenant:true
        }
      }),
      this.tenantService.countTenants({
        where:{
          userId,
        }
      })
    ])

    const allTenants = tenants.map(t => ({
      ...t,
      tenant:{
        ...t.tenant,
        createdAt: t.tenant.createdAt.toLocaleString(),
        updatedAt: t.tenant.updatedAt.toLocaleString(),
      }
    }));

    return {
      statusCode,
      message: "tenants at user",
      data: {
        allTenants,
        total
      }
    }
  } 


}
