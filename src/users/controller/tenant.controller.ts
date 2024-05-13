import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { AuthSaasGuard, TenantGuard } from 'src/auth/guard';
import { TenantService } from '../service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';

@Controller('tenant')
@UseGuards(TenantGuard)
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
    const tenantId = req.tenantId;
    const [tenants, total] = await Promise.all([
      this.tenantService.getAllTenants({
        skip,
        take: limit,
        where:{
          userId,
          tenantId
        },
        select:{
          rol:{
            select:{
              id: true,
              desc: true
            }
          },
          tenant:{
            select:{
              id: true,
              hosting: true,
              createdAt: true,
            }
          },
        }
      }),
      this.tenantService.countTenants({
        where:{
          userId,
          tenantId
        }
      })
    ])

    const allTenants = tenants.map(t => ({
      rol: t.rol,
      tenant:{
        ...t.tenant,
        createdAt: t.tenant.createdAt.toLocaleString()
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
