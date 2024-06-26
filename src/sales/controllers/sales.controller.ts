import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Permission } from 'src/auth/decorators';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { CreateBuyDto } from '../dto';
import { Request } from 'express';
import { SalesService } from '../services/sales.service';

@Controller('sales')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class SalesController {
  constructor(
    private readonly saleService: SalesService
  ){}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission("realizar venta")
  async createSales(@Body() body: CreateBuyDto, @Req() req:Request){
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const createBuy = await this.saleService.createProductSales(body,userId,tenantId);
    return {
      statusCode,
      message: "venta realizada exitosamente",
      data: createBuy
    } 
  }
}
