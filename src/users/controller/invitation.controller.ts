import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard, AuthSaasGuard, AuthServiceGuard, RolesGuard } from 'src/auth/guard';
import { UsersService } from '../service';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { InvitationService } from '../service/invitation.service';
import { CreateInvitationDto } from '../dto';
import { Permission } from 'src/auth/decorators';

@Controller('invitation')
export class InvitationController {
  
  constructor(
    private readonly userService: UsersService,
    private readonly invitationService: InvitationService
  ){}
  
  @Get("search-user")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
  @Permission("enviar invitaciones")     
  async findUserInvitation(@Query() query: QueryCommonDto, @Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const {search,skip,limit} = query;
    const [allUsers,total] = await Promise.all([
      this.userService.findAllUser({
        where: {
          AND:[
            {
              tenants:{
                every:{
                  tenantId:{
                    not: tenantId
                  },
                  userId:{
                    not: userId
                  }
                }
              },
            },
            {
              invitations:{
                every:{
                  tenantId:{
                    not: tenantId
                  }
                }
              }
            },
            {
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
          ]
          
        },
        skip,
        take: limit
      }),
      this.userService.countUsers({
        where: {
          AND:[
            {
              tenants:{
                every:{
                  tenantId:{
                    not: tenantId
                  },
                  userId:{
                    not: userId
                  }
                }
              },
            },
            {
              invitations:{
                every:{
                  tenantId:{
                    not: tenantId
                  }
                }
              }
            },
            {
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
  @UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
  @Permission("ver invitaciones")
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
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
  @Permission("enviar invitaciones")
  async createInvitation(@Body() createInvitationDto:CreateInvitationDto,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    return {
      statusCode,
      message: "invitation send",
      data:{
        invitation: await this.invitationService.createInvitation(tenantId,userId, createInvitationDto)
      }
    }
  }
  
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthSaasGuard)
  async findByIdInvitation(@Param('id',ParseIntPipe) id:number , @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const userId = req.UserId;
    return {
      statusCode,
      message: "view invitation",
      data: await this.invitationService.findByIdInvitation(id,userId)
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
  @UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
  @Permission("enviar invitaciones")
  async reseendInvitation(@Param('id',ParseIntPipe) id:number, @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const userId = req.UserId;
    return {
      statusCode,
      message: "reseend invitation",
      data: await this.invitationService.resendInvitation(id,userId)
    }
  }

  @Delete("cancel/:id")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
  @Permission("cancelar invitacion")
  async cancelInvitation(@Param('id',ParseIntPipe) id:number, @Req() req:Request){
    const statusCode = HttpStatus.OK;
    const userId = req.UserId;
    return {
      statusCode,
      message: "cancel invitation",
      data: await this.invitationService.cancelInvitation(id,userId)
    }
  }
}
