import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AtmService } from 'src/atm/services';
import { BranchService } from 'src/branch/services';
import { PrismaService } from 'src/prisma';
import { ProductService } from 'src/product/services';
import { CreateBuyDto } from '../dto';
import { ReportsService } from 'src/reports/reports.service';
import { MailsService } from 'src/mails/mails.service';
import { ISale } from '../interface';
import { PassThrough } from 'stream';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { QueryBuyDto } from 'src/buys/dto';

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
      const findTenant = await this.prisma.tenant.findUnique({
        where:{
          id: tenantId
        }
      })
      const member = await this.prisma.memberTenant.findFirst({
        where:{
          userId,
          tenantId
        }
      })
      if(findProducts.length !== body.products.length)
        throw new NotFoundException("Ingrese solo productos disponibles en la sucursal")

      const response = await this.prisma.$transaction(async(t)=>{
        let total:number = 0;
        const createSale = await t.sales.create({
          data:{
            client: body.client,
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
        const updateSale = await t.sales.update({
          where:{
            id: createSale.id
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

        const datamail: ISale = {
          nombre_empresa: findTenant.name,
          clientName: body.client,
          IdUsuario: member.id,
          logoUrl: "",
          nro_factura: createSale.id,
          products: body.products.map(b =>{
            const product = findProducts.find( p => p.id === b.productId);
            const importe = this.calculatAmount(product.price.toString(),b.cant);
            return{
              ID: product.id,
              Cantidad: b.cant,
              Precio: product.price.toString(),
              Producto: product.name,
              Total: importe
            }
          })
        }
        const billSale = await this.reportService.getBillReport(datamail);
        const bill_pdf = await this.createPdf(billSale);
        await this.mailServce.sendFactura(
          body.client,
          findTenant.name,
          bill_pdf
        )
        return {
          sale: updateSale,
          details: `${createManySale.count} detalles creado`
        }
      },{
        timeout: 500000
      });
      return response;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }
  async createPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = new PassThrough();

      doc.pipe(stream);
      doc.end();

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  async findClients(query: QueryBuyDto){
    const findClients = await this.prisma.sales.groupBy({
      by: ['client'],
      _sum: {
        total: true
      },
      where:{
        createdAt:{
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        }
      }
    })
    let total : number= 0;
    let clientEmail = "";
    findClients.map((client) => {
      const suma = client._sum.total.toNumber();
      if( suma > total){
        clientEmail = client.client;
        total = suma;
      }
    });

    const findssales = await this.prisma.detailsSales.groupBy({
      by: ['saleId'],
      _sum: {
        cant: true,
      },
      orderBy: {
        _sum: {
          cant: 'desc',
        },
      },
      take: 1,  // Seleccionar solo el primer resultado
    });
    console.log(findssales)
    if (findssales.length > 0) {
      const clientSales = findssales[0];
  
      // Obtener el cliente con mayor cantidad comprada
      const cliente = await this.prisma.sales.findUnique({
        where: {
          id: clientSales.saleId,
          createdAt:{
            gte: new Date(query.startDate),
          lte: new Date(query.endDate),
          }
        },
      });
  
      return {
        MAS_CANT:{
          client: cliente.client,
          totalCantidad: clientSales._sum.cant,
        },
        MAS_GASTADO:{
          total,
          client: clientEmail
        }
      };

    }
  }
}
