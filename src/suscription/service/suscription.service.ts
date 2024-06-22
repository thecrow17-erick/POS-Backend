import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Stripe} from 'stripe';
import { addDays} from 'date-fns';
import {v4 as uuid}from 'uuid';
import * as bcrypt  from 'bcrypt';

import { PrismaService } from 'src/prisma';
import { IOptionSuscription } from '../interface';
import { SuscriptionCreateDto } from '../dto';
import { roles } from 'src/constants';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class SuscriptionService {
  private readonly stripe: Stripe;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailsService: MailsService
  ){
    this.stripe = new Stripe(this.configService.get<string>("stripe_key"))
  }


  async findAllSuscription({
    where,
    skip,
    take,
    orderBy,
    select
  }:IOptionSuscription) {
    try {
      const allSuscriptions = await this.prisma.suscription.findMany({
        where,
        skip,
        take,
        orderBy,
        select
      })
      return allSuscriptions;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }
  async countSuscription({
    where,
    orderBy,
  }:IOptionSuscription){
    try {
      const allSuscriptions = await this.prisma.suscription.count({
        where,
        orderBy,
      })
      return allSuscriptions;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async findSuscriptionId(id: number, {
    select
  }:IOptionSuscription){
    try {
      const suscription = await this.prisma.suscription.findUnique({
        where:{
          id
        },
        select
      })
      if(!suscription)
        throw new NotFoundException(`suscription id ${id} not found`)
      
      return suscription;
    
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async paymentSuscription(createSuscription: SuscriptionCreateDto, userId: string){
    try {
      //pregunto si la suscripcion existe
      const findSuscription = await this.findSuscriptionId(createSuscription.suscriptionId,{});
      
      //PREGUNTO SI EL HOSTING NO ESTA SIENDO USADO
      const findHosting = await this.prisma.tenant.findFirst({
        where:{
          hosting: createSuscription.hosting
        }
      })
      if(findHosting)
        throw new NotFoundException(`hosting ${findHosting.hosting} is used`)

      const paymentStripe = await this.payment([
        {
          price_data:{
            product_data:{
              name: findSuscription.name,
              description: `${findSuscription.duracion} dias de suscripcion`,
            },
            currency: 'usd',
            unit_amount: findSuscription.price.toNumber() * 100
          },
          quantity: 1
        }
      ],createSuscription, userId)


      return {
        paymentStripe
      }
    } catch (error) {
      console.log(error);
      if(error instanceof NotFoundException)
        throw error;
      throw new InternalServerErrorException(`server error ${JSON.stringify(error)}`)
    }


  }

  private async payment (line_items: Stripe.Checkout.SessionCreateParams.LineItem[], metadata:SuscriptionCreateDto,userId: string) {
    const pago = await this.stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: this.configService.get<string>("stripe_sucess_url"),
        cancel_url: this.configService.get<string>("stripe_cancel_url"),
        metadata: {
          ...metadata,
          userId 
        }
    })
    return pago
  }

  async webhookPayment( body: Stripe.Metadata ){
    try {
      const dataBody = {
        hosting: body.hosting,
        suscriptionId: +body.suscriptionId,
        userId: body.userId,
        name: body.name,
      } 
      const saltOrRounds = bcrypt.genSaltSync(10)
      const suscriptionFind = await this.findSuscriptionId(dataBody.suscriptionId,{});
      const response = await this.prisma.$transaction(async(tx)=>{
        const timeNow = new Date();
        const startTime =timeNow;
        const endTime =addDays(timeNow, suscriptionFind.duracion);
        //busca si el usuario existe
        const userFind = await tx.user.findUnique({
          where:{
            id: dataBody.userId
          }
        })
        if(!userFind)
          throw new NotFoundException("user not found")

        //crea el tenant
        const tenatCreate = await tx.tenant.create({
          data:{
            name: dataBody.name,
            hosting: dataBody.hosting,
          }
        });
        //paga lo que cuesta el tenant
        const payment = await tx.paymentMembreship.create({
          data:{
            tenantId: tenatCreate.id,
            suscriptionId: dataBody.suscriptionId,
            endTime,
            startTime
          }
        })

        //el rol administrador por defecto de cada tenant
        const userRole: keyof typeof roles = 'Administrador';

        //crea el rol 
        const roleId = await tx.rol.create({
          data:{
            desc: userRole,
            tenantId: tenatCreate.id
          }
        })
        //generla contrasenha por defecto
        const password = uuid().replace("-","").substring(0,8)
        //lo pone como miembro al creador del tenant
        const memberTenantCreate = await tx.memberTenant.create({
          data:{
            passwordTenant: bcrypt.hashSync(password,saltOrRounds),
            tenantId: tenatCreate.id,
            userId: dataBody.userId,
            rolId: roleId.id
          }
        })
        //busca todos los permisos para asignarle al administrador
        const findPermissions = await tx.permission.findMany();
        //verifica si hay permisos
        if(findPermissions.length === 0)
          throw new BadRequestException("permission seed is not already inserted")

        //inserta todos los permisos al administrador del tenant
        await tx.rolePermission.createMany({
          data: findPermissions.map(p => ({
            rolId: roleId.id,
            permissionid: p.id
          }))
        })
        //enviar el email que compro el  tenant
        await this.mailsService.sendCredencialesCliente(
          userFind.name,
          userFind.email,
          suscriptionFind.name,
          tenatCreate.hosting,
          password
        )

        return {
          tenant: tenatCreate,
          members: memberTenantCreate,
          payment
        }
      })
      return response;
    } catch (err) {
      console.log(err);
      if(err instanceof BadRequestException)
        throw err
      
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

}
