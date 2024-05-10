import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Stripe} from 'stripe';
import { addDays, format,parseISO } from 'date-fns';
import {v4 as uuid}from 'uuid';

import { PrismaService } from 'src/prisma';
import { IOptionSuscription } from '../interface';
import { SuscriptionCreateDto } from '../dto';
import { roles } from 'src/constants';
import { SeedService } from '../../seed/service/seed.service';

@Injectable()
export class SuscriptionService {
  private readonly stripe: Stripe;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly seedService: SeedService
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

  async findSuscriptionId(id: number){
    try {
      const suscription = await this.prisma.suscription.findUnique({
        where:{
          id
        }
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
      const findSuscription = await this.findSuscriptionId(createSuscription.suscriptionId);
      
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
        userId: body.userId
      } 
      const suscriptionFind = await this.findSuscriptionId(dataBody.suscriptionId);
      const response = await this.prisma.$transaction(async(tx)=>{
        const timeNow = new Date();
        const startTime =timeNow;
        const endTime =addDays(timeNow, suscriptionFind.duracion);

        const tenatCreate = await tx.tenant.create({
          data:{
            hosting: dataBody.hosting,
          }
        });

        const payment = await tx.paymentMembreship.create({
          data:{
            tenantId: tenatCreate.id,
            suscriptionId: dataBody.suscriptionId,
            endTime,
            startTime
          }
        })

        const userRole: keyof typeof roles = 'Administrador';

        const roleId = await tx.rol.findFirst({
          where:{
            desc: userRole
          }
        })


        const memberTenantCreate = await tx.memberTenant.create({
          data:{
            passwordTenant: uuid().replace("-","").substring(0,8),
            rolId: roleId.id,
            tenantId: tenatCreate.id,
            userId: dataBody.userId
          }
        })
        
        return {
          tenant: tenatCreate,
          members: memberTenantCreate,
          payment
        }
      })
      await this.seedService.seedPermission(response.tenant.id);

      return response;
    } catch (err) {
      console.log(err);
      if(err instanceof BadRequestException)
        throw err
      
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

}
