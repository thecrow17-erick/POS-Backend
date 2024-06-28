import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ProductService } from '../../product/services/product.service';
import { CreateBuyDto } from '../dto';
import { BranchService } from '../../branch/services/branch.service';
import { ProviderService } from 'src/provider/services';
import { IOptionBuys } from '../interface';

@Injectable()
export class BuysService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService:ProductService,
    private readonly branchService:BranchService,
    private readonly providerService: ProviderService
  ){}

  async findIdProduct(id: number, tenantId: number,branchId: number){
    try {
      const findBranch = await this.branchService.findOne(branchId,{});

      const findProductId = await this.productService.findProducId(id,{});

      const findStock = await this.prisma.stock.findFirst({
        where:{
          productId: findProductId.id
        }
      })
      if(!findStock)
        throw new NotFoundException("no se encuentra producto en stock");
      
      const findInventory = await this.prisma.inventory.findUnique({
        where:{
          branchId_stockId:{
            branchId: findBranch.id,
            stockId: findStock.id
          }
        }
      });
      if(!findInventory)
        throw new NotFoundException("El producto no se encuentra en la sucursal");

      return findProductId;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async createBuyssProduct(body: CreateBuyDto,userId: string, tenantId: number){
    try {
      const findBranch = await this.branchService.findOne(body.branchId,{});
      const findProducts = await this.productService.findAllProducts({
        where:{
          AND:[
            {
              id: {
                in: body.products.map(b =>b.productId)
              }
            },
            {
              status: true,
            },
            {
              tenantId
            },
            {
              stock:{
                inventorys:{
                  some:{
                    branchId: findBranch.id
                  }
                }
              }
            }
          ]
        }
      })

      if(findProducts.length !== body.products.length)
        throw new NotFoundException("Ingrese solo productos disponibles en la sucursal")

      const findProvider = await this.providerService.findIdProvider(body.providerId,{});

      const response = await this.prisma.$transaction(async (t)=>{
        let total: number = 0;
        const createBuy = await t.buys.create({
          data:{
            tenantId,
            providerId: findProvider.id,
            total,
            userId
          }
        });
        const createDeatilBuy = await t.detailsBuys.createMany({
          data: body.products.map(b => {
            const importe = this.calculatAmount(b.price,b.cant);
            total += importe;
            return {
              buyId: createBuy.id,
              cant: b.cant,
              import: importe,
              price: b.price,
              productId: b.productId
            }
          })
        })
        const updateBuy = await t.buys.update({
          where:{
            id: createBuy.id
          },
          data:{
            total
          }
        })
        for (const product of body.products) {
          const findStock = await this.prisma.stock.findFirst({
            where:{
              productId: product.productId
            }
          })
          if(!findStock){
            throw new NotFoundException(`Cree el stock del producto  ${product.productId}`)
          }
          await t.stock.update({
            where: {
              id: findStock.id
            },
            data: {
              cantTotal: {
                increment: product.cant
              },
              inventorys: {
                update: {
                  where: {
                    branchId_stockId: {
                      branchId: findBranch.id,
                      stockId: findStock.id
                    }
                  },
                  data: {
                    cant: {
                      increment: product.cant
                    }
                  }
                }
              }
            }
          });
        }
        
        return{
          buy: updateBuy,
          detailBuy: `${createDeatilBuy.count} detalles de compra insertada`
        }
      })
      return response;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err

      console.log(err)
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  calculatAmount(price: string, cant:number){
    return parseFloat(price) * cant; 
  }

  async findAllBuyss({
    where,
    skip,
    take,
    select,
    orderBy,
  }:IOptionBuys){
    try {
      const allBuys = await this.prisma.buys.findMany({
        where,
        select,
        skip,
        take,
        orderBy,
      })
      return allBuys;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async countBuyss({
    where,
  }:IOptionBuys){
    try {
      const allBuys = await this.prisma.buys.count({
        where,
      })
      return allBuys;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

}
