import { Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ProductService } from '../../product/services/product.service';
import { CreateBuyDto, InsertProductDto } from '../dto';
import { BranchService } from '../../branch/services/branch.service';
import { ProviderService } from 'src/provider/services';

@Injectable()
export class BuysService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService:ProductService,
    private readonly branchService:BranchService,
    private readonly providerService: ProviderService
  ){}

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
}
