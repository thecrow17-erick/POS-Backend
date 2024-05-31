import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard,IsAdminGuard } from 'src/auth/guard';
import { UsersService } from '../service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { InvitationService } from '../service/invitation.service';
import { CreateInvitationDto } from '../dto';

@Controller('invitation')
@UseGuards(TenantGuard,IsAdminGuard) 
export class InvitationController {
  
  constructor(
    private readonly userService: UsersService,
    private readonly invitationService: InvitationService
  ){}

  @Get("search-user")
  @HttpCode(HttpStatus.OK)
  async findUserInvitation(@Query() query: QueryCommonDto){
    const statusCode = HttpStatus.OK;
    const {search,skip,limit} = query;
    const [allUsers,total] = await Promise.all([
      this.userService.findAllUser({
        where: {
          OR:[
            {
              name:{
                contains: search,
                mode: "insensitive"
              }
            },
            {
              email: {
                contains: search,
                mode: "insensitive"
              },
            }
          ]
        },
        skip,
        take: limit
      }),
      this.userService.countUsers({
        where: {
          OR:[
            {
              name:{
                contains: search,
                mode: "insensitive"
              }
            },
            {
              email: {
                contains: search,
                mode: "insensitive"
              },
            }
          ]
        }
      })
    ])
    return {
      statusCode,
      message: "find user",
      data:{
        allUsers,
        total
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async allInvitation(@Query() query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {skip,limit} = query;
    const [allInvitations,total] = await Promise.all([
      this.invitationService.allInvitation({
        where:{
          tenantId,
        },
        skip,
        take: limit
      }),
      this.invitationService.countInvitation({
        where:{
          tenantId,
        }
      })
    ])
    return {
      statusCode,
      message: "find user",
      data:{
        allInvitations,
        total
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createInvitation(@Body() createInvitationDto:CreateInvitationDto,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    return {
      statusCode,
      message: "invitation send",
      data:{
        invitation: await this.invitationService.createInvitation(tenantId, createInvitationDto)
      }
    }
  }
  
}
