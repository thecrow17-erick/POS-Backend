import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SuscriptionService } from '../service/suscription.service';
import { QueryCommonDto } from '../../common/dto/query-common.dto';
import { SuscriptionCreateDto } from '../dto';
import { Request } from 'express';
import { Stripe } from 'stripe';
import { AuthSaasGuard } from 'src/auth/guard';

@Controller('suscription')
export class SuscriptionController {

  constructor(
    private readonly suscriptionService: SuscriptionService
  ){}

  @Get()
  @HttpCode(HttpStatus.OK)
  async allSuscription(@Query() query: QueryCommonDto){
    const statusCode = HttpStatus.OK;
    const {limit,skip} = query;
    const [total,allSuscription] = await Promise.all([
      this.suscriptionService.countSuscription({}),
      this.suscriptionService.findAllSuscription({
        skip,
        take: limit,
      })
    ])
    return{
      statusCode,
      message: "all suscriptions",
      data:{
        total,
        allSuscription
      }
    }
  } 
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthSaasGuard)
  async createSuscription(@Body() createdSuscription: SuscriptionCreateDto, @Req() req: Request){
    const statusCode = HttpStatus.CREATED;
    const userId = req.UserId;
    const paymentSuscription = await this.suscriptionService.paymentSuscription(createdSuscription,userId)
    return {
      statusCode,
      message: "payment is loading",
      data:{
        paymentSuscription
      }
    }
  }

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async webhookPaymentStripe(@Body() body: Stripe.CheckoutSessionCompletedEvent){
    const statusCode = HttpStatus.OK;
    const metadata = body.data.object.metadata;
    const responseWebhook = await this.suscriptionService.webhookPayment(metadata)

    return{
      statusCode,
      message: "webhooke completed",
      data: {
        responseWebhook
      }
    } 
  }
}
