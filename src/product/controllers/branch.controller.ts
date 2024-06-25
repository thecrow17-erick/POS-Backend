import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Permission } from 'src/auth/decorators';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { BranchService } from 'src/branch/services';
import { QueryCommonDto } from 'src/common';
import { BranchProductService } from '../services/branch-product.service';
import { AddBranchProductDto } from '../dto';

@Controller('branch')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class BranchController {

  constructor(
    private readonly branchService: BranchService,
    private readonly branchProductService:BranchProductService
  ){}

  @Get("product/:id")
  @HttpCode(HttpStatus.OK)
  @Permission("agregar producto a sucursal")
  async findBranchs(@Param('id',ParseIntPipe) productId: number, @Query() query: QueryCommonDto, @Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,search,skip} = query;
    const [total, branchs] =await Promise.all([
      this.branchService.countAll({
        where:{
          AND: [
            {
              inventorys:{
                some:{
                  stock:{
                    productId:{
                      not: productId
                    }
                  }
                }
              }
            },
            {
              name:{
                contains: search,
                mode: "insensitive"
              }
            },
            {
              status: true
            },
            {
              tenantId
            }
          ]
        },
      }),
      this.branchService.findAll({
        where:{
          AND: [
            {
              inventorys:{
                every:{
                  stock:{
                    productId:{
                      not: productId
                    }
                  }
                }
              }
            },
            {
              name:{
                contains: search,
                mode: "insensitive"
              }
            },
            {
              status: true
            },
            {
              tenantId
            }
          ]
        },
        select:{
          id: true,
          city: true,
          name: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit
      })
    ]);
    return{
      statusCode,
      message: "todas las sucursales",
      data:{
        total,
        branchs
      }
    }
  }

  @Get("product/:id/view")
  @HttpCode(HttpStatus.OK)
  @Permission("ver sucursales de producto")
  async allBranchsProduct(@Param('id',ParseIntPipe) productId: number, @Query() query: QueryCommonDto, @Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,search,skip} = query;
    const  stock = await this.branchProductService.findAllStock({
        where:{
          AND: [
            {
              inventorys:{
                some:{
                  stock:{
                    productId
                  },
                  branch:{
                    name:{
                      contains: search,
                      mode: "insensitive"
                    }
                  }
                }
              }
            },
            {
              tenantId
            }
          ]
        },
        select:{
          id: true,
          inventorys: {
            select:{
              cant: true,
              branch:{
                select:{
                  id: true,
                  city: true,
                  name: true,
                  address: true,
                  status: true,
                  updatedAt: true,
                }
              }
            }
          },
          cantTotal: true,
          updatedAt: true,
        },
        skip,
        take: limit
      })
    return{
      statusCode,
      message: "todas las sucursales",
      data:{
        stock
      }
    }
  }

  @Post("product/:id")
  @HttpCode(HttpStatus.CREATED)
  @Permission("agregar producto a sucursal")
  async addBranchsProduct(@Body() body:AddBranchProductDto ,@Param('id',ParseIntPipe) productId: number, @Req() req: Request){
    console.log(productId)
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const branchs = await this.branchProductService.addProductBranch(productId,body, tenantId);
    console.log(branchs);
    return {
      statusCode,
      message: "agregar el producto a sucursales",
      data: {
        branchs
      }
    }
  }
}
