import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard,IsAdminGuard, AuthSaasGuard } from 'src/auth/guard';
import { UsersService } from '../service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { InvitationService } from '../service/invitation.service';
import { CreateInvitationDto } from '../dto';

@Controller('invitation')
export class InvitationController {
  
  constructor(
    private readonly userService: UsersService,
    private readonly invitationService: InvitationService
  ){}
  
  @Get("search-user")
  @UseGuards(TenantGuard,IsAdminGuard) 
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
  @UseGuards(TenantGuard,IsAdminGuard) 
  @HttpCode(HttpStatus.OK)
  async allInvitation(@Query() query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {skip,limit} = query;
    const [invitations,total] = await Promise.all([
      this.invitationService.allInvitation({
        where:{
          tenantId,
        },
        skip,
        take: limit,
        select:{
          id: true,
          rol: true,
          state: true,
          user: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      this.invitationService.countInvitation({
        where:{
          tenantId,
        }
      })
    ])

    const allInvitations = invitations.map(invitation => ({
      ...invitation,
      createdAt: invitation.createdAt.toLocaleString(),
      updatedAt: invitation.updatedAt.toLocaleString(),
    }))


    return {
      statusCode,
      message: "all invitation user",
      data:{
        allInvitations,
        total
      }
    }
  }

  @Post()
  @UseGuards(TenantGuard,IsAdminGuard) 
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
  

  @Patch("accept/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthSaasGuard)
  async acceptInvitation(@Param('id',ParseIntPipe) id:number , @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const {UserId} = req;
    return {
      statusCode,
      message: "accept invitation",
      data: await this.invitationService.acceptInvitation(id, UserId)
    }
  }

  @Patch("resend/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TenantGuard,IsAdminGuard)
  async reseendInvitation(@Param('id',ParseIntPipe) id:number){
    const statusCode = HttpStatus.OK;
    return {
      statusCode,
      message: "reseend invitation",
      data: await this.invitationService.resendInvitation(id)
    }
  }

  @Delete("cancel/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TenantGuard,IsAdminGuard)
  async cancelInvitation(@Param('id',ParseIntPipe) id:number){
    const statusCode = HttpStatus.OK;
    return {
      statusCode,
      message: "cancel invitation",
      data: await this.invitationService.cancelInvitation(id)
    }
  }
}
