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
@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailsService,
    private readonly configService: ConfigService
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
      const userFind = await this.prisma.user.findUnique({
        where:{
          id: createInvitationDto.userId
        }
      });
      if(!userFind)
        throw new NotFoundException("invite a valid user")
      
      const tenant = await this.prisma.tenant.findUnique({
        where:{
          id: tenantId
        }
      })

      const rolFind = await this.prisma.rol.findUnique({
        where:{
          id: createInvitationDto.rolId
        }
      })
      if(!rolFind)
        throw new NotFoundException("insert a valid role")

      const findInvitation = await this.prisma.invitationTenant.findFirst({
        where:{
          tenantId,
          userId: userFind.id,
        }
      })
      if(findInvitation){
        if(findInvitation.state === "ESPERA")
          throw new BadRequestException("The user already has an invitation")

        if(findInvitation.state === "ACEPTADO")
          throw new BadRequestException("The user has already accepted the invitation")

        if(findInvitation.state === "VENCIDO" || findInvitation.state === "CANCELADO")
          throw new BadRequestException("reesend invitation")

      }

      const response = await this.prisma.$transaction(async(tx) =>{
        const invitationCreate =await tx.invitationTenant.create({
          data:{
            tenantId,
            rolId: rolFind.id,
            userId: userFind.id,
            state: "ESPERA"
          }
        });

        await this.mailService.sendInvitacion(
          userFind.name,
          userFind.email,
          tenant.hosting,
          `${this.configService.get<string>("frontend_url")}/invitation/${invitationCreate.id}`
        )
        return invitationCreate;
      })
      const afternow = addDays(new Date(),1);
      schedule.scheduleJob(afternow, async()=>{
        console.log("test invitation")
        const invitationFind = await this.prisma.invitationTenant.findUnique({
          where:{
            id: response.id
          }
        });
        if(invitationFind.state === "ESPERA"){
          await this.prisma.invitationTenant.update({
            where:{
              id: response.id
            },
            data:{
              state:"VENCIDO"
            }
          })
        }
      })

      return response;

    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      if(err instanceof BadRequestException)
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
          passwordTenant: bcrypt.hashSync(password,saltOrRounds)
        }
      });

      const memberRole = await this.prisma.memberRole.create({
        data:{
          memberId: memeberTenant.id,
          rolId: findInvitationId.rolId
        }
      })
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
        memberRole
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
            id: invitationUpdate.id
          }
        });
        if(invitationFind.state === "ESPERA"){
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
