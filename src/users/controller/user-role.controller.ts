import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { UserRoleService } from '../service/user-role.service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';

@Controller('user-role')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class UserRoleController {
  
  constructor(
    private readonly userRoleService:UserRoleService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permission("view user-roles")
  async allUserRoles(@Query() query: QueryCommonDto, @Req() req: Request){
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const {limit,search,skip} = query;
    const statusCode = HttpStatus.OK;
    const [users, total] = await Promise.all([
      this.userRoleService.allUserRole({
        where:{
          userId:{
            not: userId
          },
          user:{
            name:{
              contains: search,
              mode: "insensitive"
            }
          },
          tenantId
        },
        skip,
        take: limit,
        select:{
          id: true,
          user: true,
        }
      }),
      this.userRoleService.countUserRole({
        where:{
          userId:{
            not: userId
          },
          tenantId
        }
      })
    ])

    const allUsersRole = users.map((user)=>({
      ...user,
      user: {
        ...user.user,
        createdAt: user.user.createdAt.toLocaleString(),
        updatedAt: user.user.updatedAt.toLocaleString()
      }
    }))
    return{
      statusCode,
      message: "all user roles",
      data:{
        total,
        allUsersRole
      }
    }
  }

}
