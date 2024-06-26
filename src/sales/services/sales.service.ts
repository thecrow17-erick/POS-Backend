import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AtmService } from 'src/atm/services';
import { BranchService } from 'src/branch/services';
import { PrismaService } from 'src/prisma';
import { ProductService } from 'src/product/services';
import { CreateBuyDto } from '../dto';
import { ReportsService } from 'src/reports/reports.service';
import { MailsModule } from 'src/mails/mails.module';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class SalesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService:ProductService,
    private readonly branchService:BranchService,
    private readonly atmService: AtmService,
    private readonly reportService: ReportsService,
    private readonly mailServce: MailsService
  ){}

  calculatAmount(price: string, cant:number){
    return parseFloat(price) * cant; 
  }
  async createProductSales(body: CreateBuyDto,userId: string, tenantId: number){
    try {
      const findBranch = await this.branchService.findOne(body.branchId,{});
      const findClient = await this.findClienId(body.clientId);
      const findAtm = await this.atmService.findOne(body.atmId,{});
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
                    cant: {
                      gte: 0
                    },
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

      const response = await this.prisma.$transaction(async(t)=>{
        let total:number = 0;
        const createSale = await t.sales.create({
          data:{
            clientId: findClient.id,
            state: "VENDIDO",
            statePay: body.type,
            nitClient: body.nitClient,
            pay: body.pay,
            change: body.change,
            total,
            atmId: findAtm.id,
            tenantId,
          }
        });
        console.log(createSale);
        const createManySale = await t.detailsSales.createMany({
          data: body.products.map((b) =>{  
            const product = findProducts.find( p => p.id === b.productId);
            const importe = this.calculatAmount(product.price.toString(),b.cant);
            total += importe;
            return{ 
              productId: product.id,
              cant: b.cant,
              import: importe,
              saleId: createSale.id
            }   
          })
        })
        console.log(createManySale);
        const updateSale = await t.sales.update({
          where:{
            id: createSale.id
          },
          data:{
            total
          }
        })
        console.log(updateSale);
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
                decrement: product.cant
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
                      decrement: product.cant
                    }
                  }
                }
              }
            }
          });
        }
        return {
          sale: updateSale,
          details: `${createManySale.count} detalles creado`
        }
      });
      return response;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }


  async findClienId(id: string){
    try {
      const findClient = await this.prisma.client.findUnique({
        where:{
          id
        }
      })
      if(!findClient)
        throw new NotFoundException("cliente no esta disponible")

      return findClient;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }
  
}
