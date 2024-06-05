import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionInvitation } from '../interface';
import { CreateInvitationDto } from '../dto';
import { MailsService } from 'src/mails/mails.service';
import { ConfigService } from '@nestjs/config';
import * as schedule from 'node-schedule';
import { addDays } from 'date-fns';
import {v4 as uuid} from 'uuid'
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { RoleService } from './role.service';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailsService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly roleService: RoleService
  ){}

  async allInvitation({
    where,
    take,
    skip,
    select,
    orderBy
  }:IOptionInvitation){
    try {
      const allInvitation = await this.prisma.invitationTenant.findMany({
        where,
        take,
        skip,
        select,
        orderBy
      })      
      return allInvitation;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async countInvitation({
    where,
  }:IOptionInvitation){
    try {
      const allInvitation = await this.prisma.invitationTenant.count({
        where,
      })      
      return allInvitation;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async createInvitation(tenantId:number, createInvitationDto:CreateInvitationDto){
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where:{
          id: tenantId
        }
      })

      const findUsers = await this.userService.findAllUser({
        where: {
          id: {
            in: createInvitationDto.users
          }
        }
      })
      if(findUsers.length !== createInvitationDto.users.length)
        throw new BadRequestException("Algun usuario no coincide, intente nuevamente.")
  
      const roleId = await this.roleService.findRoleId(createInvitationDto.rolId,tenantId);

      const usersCreate = await this.prisma.invitationTenant.createMany({
        data: findUsers.map(user => ({
          userId: user.id,
          rolId:roleId.id,
          tenantId,
          state: "ESPERA"
        }))
      })
      findUsers.map(async(user) => {
        const invitation = await this.prisma.invitationTenant.findFirst({
          where:{
            AND: [
              {
                tenantId:tenant.id,
              },
              {
                userId: user.id
              }
            ]
          }
        })

        await this.mailService.sendInvitacion(
          user.name,
          user.email,
          tenant.hosting,
          `${this.configService.get<string>("frontend_url")}/invitation/${invitation.id}`
        );
      })

      const afternow = addDays(new Date(),1);
      schedule.scheduleJob(afternow , async()=>{
        const findInvitation = await this.prisma.invitationTenant.findMany({
          where:{
            AND:[
              {
                userId:{
                  in: createInvitationDto.users
                }
              },
              {
                state: "ESPERA"
              }
            ]
          }
        })
        if(findInvitation.length){
          await this.prisma.invitationTenant.updateMany({
            where:{
              id: {
                in: findInvitation.map(i => i.id)
              },
            },
            data: {
              state: "VENCIDO"
            }
          })
        }
      })

      return {
        invitation: `${usersCreate.count} invitaciones enviadas correctamente`
      }
    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;
      
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${err}`)

    }
  }

  async findByIdInvitation(invitationId: number,userId: string){
    try {
      const findInvitationId= await this.prisma.invitationTenant.findUnique({
        where:{
          id: invitationId,
          state: "ESPERA",
          userId          
        },
        select:{
          rol: true,
          id: true,
          state: true,
          createdAt: true,
          tenant: true,
          user: true,
        }
      })
      if(!findInvitationId)
        throw new NotFoundException("the invitation is expired")

      return findInvitationId;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async acceptInvitation(invitationId: number, userId: string){
    try {
      const findInvitationId = await this.prisma.invitationTenant.findFirst({
        where:{
          AND:[
            {
              id: invitationId
            },
            {
              userId
            },
            {
              state: "ESPERA"
            }
          ]
        }
      })
      if(!findInvitationId) 
        throw new NotFoundException("The invitation does not exist or its status is false or accept")
      
      //generla contrasenha por defecto
      const saltOrRounds = bcrypt.genSaltSync(10)
      const password = uuid().replace("-","").substring(0,8)

      const invitationUpdate = await this.prisma.invitationTenant.update({
        where:{
          id: findInvitationId.id
        },
        data:{
          state: "ACEPTADO"
        },
        select:{
          user: true,
          rol: true,
          tenant: true,
        }
      });

      const memeberTenant = await this.prisma.memberTenant.create({
        data:{
          tenantId: findInvitationId.tenantId,
          userId: findInvitationId.userId,
          passwordTenant: bcrypt.hashSync(password,saltOrRounds),
          rolId: findInvitationId.rolId
        }
      });
      await this.mailService.sendCredencialesUser(
        invitationUpdate.user.name,
        invitationUpdate.user.email,
        invitationUpdate.tenant.hosting,
        `${this.configService.get<string>("frontend_url")}`,
        password
      )
      return{
        invitation: invitationUpdate,
        memeberTenant,
      }
    }catch(err){
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async resendInvitation(invitationId: number){
    try {
      const findInvitation = await this.prisma.invitationTenant.findFirst({
        where:{
          AND: [
            {
              id: invitationId
            },
            {
              OR:[
                {
                  state: "VENCIDO"
                },
                {
                  state: "CANCELADO"
                }
              ]
            }
          ]
        }
      })
      if(!findInvitation)
        throw new BadRequestException("the invitation cannot be forwarded")

      const invitationUpdate = await this.prisma.invitationTenant.update({
        where:{
          id: findInvitation.id
        },
        data:{
          state: "ESPERA"
        },
        select:{
          id: true,
          tenant: true,
          rol: true,
          user: true,
          state: true,
          status: true,
        }
      })
      await this.mailService.sendInvitacion(
        invitationUpdate.user.name,
        invitationUpdate.user.email,
        invitationUpdate.tenant.hosting,
        `${this.configService.get<string>("frontend_url")}/invitation/${invitationUpdate.id}`
      )
      const afternow = addDays(new Date(),1);
      schedule.scheduleJob(afternow, async()=>{
        console.log("test invitation")
        const invitationFind = await this.prisma.invitationTenant.findUnique({
          where:{
            id: invitationUpdate.id,
            OR: [
              {
                state: "ESPERA"
              }
            ]
          }
        });
        if(invitationFind){
          await this.prisma.invitationTenant.update({
            where:{
              id: invitationUpdate.id
            },
            data:{
              state:"VENCIDO"
            }
          })
        }
      })

      return invitationUpdate;
    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }

  async cancelInvitation(invitationId: number){
    try {
      const findInvitation = await this.prisma.invitationTenant.findFirst({
        where:{
          AND: [
            {
              id: invitationId
            },
            {
              state: "ESPERA"
            }
          ]
        }
      })
      if(!findInvitation)
        throw new BadRequestException("You cannot cancel the invitation because it has already been canceled")

      const invitationCancel = await this.prisma.invitationTenant.update({
        where:{
          id: findInvitation.id
        },
        data:{
          state: "CANCELADO"
        }
      })

      return {
        invitation: invitationCancel
      }
    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }
}
