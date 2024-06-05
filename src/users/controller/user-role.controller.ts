import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { UserRoleService } from '../service/user-role.service';
import { Permission } from 'src/auth/decorators';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { AsignInvitationDto } from '../dto';

@Controller('user-role')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class UserRoleController {

  constructor(
    private readonly userRoleService: UserRoleService
  ){} 
  
  @Get()
  @Permission("ver empleado")
  @HttpCode(HttpStatus.OK)
  async allUserRole(@Query() query: QueryCommonDto, @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const {limit,search,skip} = query;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const [users,total] = await Promise.all([
      this.userRoleService.allUserRole({
        where:{
          userId: {
            not: userId
          },
          tenantId,
          user:{
            name:{
              contains: search,
              mode: "insensitive"
            }
          }
        },
        skip,
        take: limit,
        select:{
          id: true,
          user: true,
          rol: true,
          createdAt: true,
          updatedAt: true,
        }
      }),
      this.userRoleService.countUserRole({
        where:{
          userId: {
            not: userId
          },
          tenantId,
          user:{
            name:{
              contains: search,
              mode: "insensitive"
            }
          }
        }
      })
    ])

    const allUsers = users.map(user => ({
      ...user,
      createdAt: user.createdAt.toLocaleString(),
      updatedAt: user.updatedAt.toLocaleString()
    }));

    return {
      statusCode,
      message: "all user roles",
      data: {
        total,
        allUsers
      }
    }
  }

  @Patch(":id")
  @Permission("actualizar rol miembro")
  @HttpCode(HttpStatus.OK)
  async updateRoleMember(@Param('id',ParseIntPipe) id:number ,@Body() asignInvitationDto:AsignInvitationDto, @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    return {
      statusCode,
      message: "member update role",
      data: {
        user: await this.userRoleService.updateUserRole(tenantId,id,asignInvitationDto)
      }
    }
  }

  @Get(":id")
  @Permission("ver empleado")
  @HttpCode(HttpStatus.OK)
  async findByIdEmployee(@Param('id',ParseIntPipe) id:number , @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const user = await this.userRoleService.findByIdMember(tenantId,id)

    const employee = {
      ...user,
      createdAt: user.createdAt.toLocaleString(),
      updatedAt: user.updatedAt.toLocaleString()
    }

    return {
      statusCode,
      message: "view employee",
      data: {
        employee
      }
    }
  }
}

