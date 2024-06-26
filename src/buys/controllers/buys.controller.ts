import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Permission } from 'src/auth/decorators';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { BranchService } from 'src/branch/services';
import { QueryCommonDto } from 'src/common';
import { ProductService } from 'src/product/services';
import { ProviderService } from 'src/provider/services';
import { CreateBuyDto, QueryBuyDto } from '../dto';
import { BuysService } from '../services';

@Controller('buy')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class BuysController {

  constructor(
    private readonly productService: ProductService,
    private readonly providerService: ProviderService,
    private readonly branchService: BranchService,
    private readonly buyService: BuysService
  ) {} 

  @Get("product/:id")
  @HttpCode(HttpStatus.OK)
  @Permission("realizar comprar")
  async findProductId(@Param('id', ParseIntPipe)productId: number){
    const statusCode = HttpStatus.OK;
    return{
      statusCode,
      message: "buscar producto",
      data:{
        product: await this.productService.findProducId(productId,{})
      }
    }
  } 

  @Get("provider")
  @HttpCode(HttpStatus.OK)
  @Permission("realizar comprar")
  async findProviders(@Query() query: QueryCommonDto,@Req() req:Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,search,skip} = query;
    const [total, providers] = await Promise.all([
      this.providerService.countProvider({
        where:{
          email:{
            contains: search,
            mode: "insensitive"
          },
          tenantId,
          status: true
        }
      }),
      this.providerService.findAllProviders({
        where:{
          email:{
            contains: search,
            mode: "insensitive"
          },
          tenantId,
          status: true
        },
        skip,
        take: limit
      })
    ])
    return {
      statusCode,
      message: "proveedores para comprar",
      data:{
        total,
        providers
      }
    }
  } 

  @Get("branch")
  @HttpCode(HttpStatus.OK)
  @Permission("realizar comprar")
  async findBranchs(@Query() query: QueryCommonDto,@Req() req:Request){
    const statusCode = HttpStatus.OK;
    const {limit,search,skip} = query;
    const tenantId = req.tenantId;
    const [total,branchs] = await Promise.all([
      this.branchService.countAll({
        where:{
          name: {
            contains: search,
            mode: "insensitive"
          },
          tenantId,
          status: true
        }
      }),
      this.branchService.findAll({
        where:{
          name: {
            contains: search,
            mode: "insensitive"
          },
          tenantId,
          status: true
        },
        skip,
        take: limit,
        select: {
          id: true,
          address: true,
          name: true,
          city: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    ])  
    return{
      statusCode,
      message: "todos las sucursales",
      data:{
        total,
        branchs
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission("realizar comprar")
  async createBuys(@Body() body:CreateBuyDto,@Req() req:Request){
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const createBuy = await this.buyService.createBuyssProduct(body,userId,tenantId);
    return {
      statusCode,
      message: "compra de insumos creado",
      data: createBuy
    } 
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permission("ver compras")
  async findAllBuy(@Query() query: QueryBuyDto,@Req() req:Request){
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const {startDate,endDate,limit,skip} = query;
    console.log({endDate,startDate})
    const [total,allBuys] = await Promise.all([
      this.buyService.countBuyss({
        where:{
          tenantId,
          createdAt:{
            gte: startDate,
            lte: endDate,
          }
        }
      }),
      this.buyService.findAllBuyss({
        where:{
          tenantId,
          createdAt:{
            gte: startDate,
            lte: endDate,
          }
        },
        skip,
        take:limit,
        select:{
          id: true,
          provider: true,
          user: true,
          total: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    ])

    const buys = allBuys.map(buy => ({
      ...buy,
      createdAt: buy.createdAt.toLocaleString(),
      updatedAt: buy.updatedAt.toLocaleString(),
    }))

    return {
      statusCode,
      message: "compra de insumos creado",
      data:{
        total,
        buys
      }
    } 
  }
}
