import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { Permission } from 'src/auth/decorators';
import { AuthServiceGuard, RolesGuard } from 'src/auth/guard';
import { ProductService } from 'src/product/services';
import { productsQueryDto } from '../dto/products-query.dto';
import { Request } from 'express';
import { TenantGuard } from '../../auth/guard/tenant.guard';
import { QueryCommonDto } from 'src/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
@UseGuards(AuthServiceGuard, TenantGuard,RolesGuard)
export class InventoryController {
  constructor(
    private readonly productService: ProductService,
    private readonly inventoryService:InventoryService
  ){}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @Permission("realizar venta")
  async findProduct(@Query() query:QueryCommonDto, @Param('id',ParseIntPipe) branchId: number ,@Req() req: Request){
    const statusCode = HttpStatus.OK;  
    const tenantId = req.tenantId;
    const {skip,limit,search} = query;
    const [total, products] = await Promise.all([
      this.inventoryService.countInventory({
        where:{
          branchId,
          stock:{
            tenantId,
            product:{
              name: {
                contains: search,
                mode: "insensitive"
              },
              status: true
            }
          }
        }
      }),
      this.inventoryService.findAllInventory({
        where:{
          branchId,
          stock:{
            tenantId,
            product:{
              name: {
                contains: search,
                mode: "insensitive"
              },
              status: true
            }
          }
        },
        skip,
        take:limit,
        select:{
          cant: true,
          stock:{
            select:{
              id: true,
              product:{
                select:{
                  id: true,
                  categories: true,
                  images: true,
                  name: true,
                  price: true,
                  discount: true,
                  description: true,
                  createdAt: true,
                  updatedAt: true
                }
              }
            }
          }
        }
      })
    ]) 
    return {
      statusCode,
      message: "todos los productos",
      data: {
        total,
        products
      }
    }
  }

}
