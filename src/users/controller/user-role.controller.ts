import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { UserRoleService } from '../service/user-role.service';
import { Permission } from 'src/auth/decorators';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';

@Controller('user-role')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class UserRoleController {

  constructor(
    private readonly userRoleService: UserRoleService
  ){} 
  
  @Get()
  @Permission("view user-role")
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
      user: {
        ...user.user,
        createdAt: user.user.createdAt.toLocaleString(),
        updatedAt: user.user.updatedAt.toLocaleString()
      }
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

}

