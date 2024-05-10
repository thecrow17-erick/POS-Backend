import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { ProductCreateDto } from '../dto/create-product.dto';
import { TenantGuard } from 'src/auth/guard';
import { Request } from 'express';
import { ProductService } from '../services/product.service';
import { AzureConnectionService } from 'src/azure-connection/azure-connection.service';
import { QueryCommonDto } from 'src/common';

@Controller('product')
@UseGuards(TenantGuard)
export class ProductController {

  constructor(
    private readonly productService: ProductService,
    private readonly azureService: AzureConnectionService
  ){}

  @Get()
  @HttpCode(HttpStatus.OK)
  async allProducts(@Query() query: QueryCommonDto,@Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,skip} = query;
    const [products,total] = await Promise.all([
      this.productService.findAllProducts({
        where:{
          tenantId
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          discount: true,
          price: true,
          images: true,
          categoys: {
            select: {
              category:{
                select:{
                  id: true,
                  description: true
                }
              }
            } 
          },
          createdAt: true,
          updatedAt: true,
        }
      }),
      this.productService.countProduct({
        where:{
          tenantId
        }
      })
    ])
    const allProducts = await Promise.all(products.map(async (product) => ({
      ...product,
      images: await Promise.all(product.images.map(async (img) => await this.azureService.getImageUrl(img, 'imagenes'))),
      createdAt: product.createdAt.toLocaleString(),
      updatedAt: product.updatedAt.toLocaleString(),
    })));
    return {
      statusCode,
      message: "all products",
      data: {
        allProducts,
        total
      }
    }
  } 

  @Post()
  @FormDataRequest({
    storage: MemoryStoredFile
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: ProductCreateDto,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED
    const tenantId = req.tenantId;
    const product = await this.productService.createProduct(body,tenantId);
    return {
      statusCode,
      message: "product created",
      data: {
        ...product
      }
    }
  }
}
