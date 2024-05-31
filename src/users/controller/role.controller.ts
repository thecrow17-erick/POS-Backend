import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TenantGuard } from 'src/auth/guard';
import { IsAdminGuard } from 'src/auth/guard/is-admin.guard';
import { roles } from 'src/constants';
import { RoleService } from '../service/role.service';
import { QueryCommonDto } from 'src/common';
import { CreateRolDto } from '../dto';

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
    const {limit,skip,search} = query;
    const roleAdmin: keyof typeof roles = "Administrador";
    const [total, totalroles] = await Promise.all([
      this.roleService.countTenantRoles({
        where:{
          tenantId,
          desc:{
            not: roleAdmin,
            contains:search,
            mode: "insensitive"
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
  @Get("permission")
  @HttpCode(HttpStatus.OK)
  async allPermission(@Query() query: QueryCommonDto){
    const statusCode = HttpStatus.OK
    const {limit,skip,search} = query;
    const [allPermission, total] = await Promise.all([
      this.roleService.allPermission({
        where:{
          desc: {
            contains:search,
            mode: "insensitive"
          }
        },
        skip,
        take: limit
      }),
      this.roleService.countPermission({
        where:{
          desc: {
            contains:search,
            mode: "insensitive"
          }
        }
      })
    ])
    return {
      statusCode,
      message: "all permission",
      data:{
        total,
        allPermission
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRol(@Body() createRolDto:CreateRolDto,@Req() req:Request){
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    return {
      statusCode,
      message: "rol create",
      data: await this.roleService.createRol(tenantId, createRolDto)
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteRol(@Param("id",ParseIntPipe) id:number,@Req() req:Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    return{
      statusCode,
      message: "delete rol",
      data:{
        role: await this.roleService.deleteRol(id, tenantId)
      }
    }
  }

}