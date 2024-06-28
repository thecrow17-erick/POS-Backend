import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { ProductCreateDto } from '../dto/create-product.dto';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Request } from 'express';
import { ProductService } from '../services/product.service';
import { AzureConnectionService } from 'src/azure-connection/azure-connection.service';
import { QueryCommonDto } from 'src/common';
import { UpdateProductDto } from '../dto';
import { Permission } from 'src/auth/decorators';
import { CategoryService } from 'src/category/services';

@Controller('product')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class ProductController {

  constructor(
    private readonly productService: ProductService,
    private readonly azureService: AzureConnectionService,
    private readonly categoryService: CategoryService
  ){}

  @Get("category")
  @HttpCode(HttpStatus.OK)
  @Permission("crear producto")
  async allCategories(@Query() query: QueryCommonDto,@Req() req: Request){
    const tenantId = req.tenantId;
    const {limit,skip} = query;
    const statusCode = HttpStatus.OK
    const [total, allCategories] = await Promise.all([
      this.categoryService.countCategory({
        where:{
          tenantId
        }
      }),
      this.categoryService.allCategories({
        where:{
          tenantId,
        },
        skip,
        take: limit,
      })
    ])

    return {
      statusCode,
      message: "all categories",
      data: {
        total,
        allCategories
      }
    }
  }

  @Get()
  @Permission("ver producto")
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
          categories: {
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
  @Permission("crear producto")
  @FormDataRequest({
    storage: MemoryStoredFile
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: ProductCreateDto,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const product = await this.productService.createProduct(body,userId,tenantId);
    return {
      statusCode,
      message: "product created",
      data: {
        ...product
      }
    }
  }

  @Get(':id')
  @Permission("ver producto")
  @HttpCode(HttpStatus.ACCEPTED)
  async getProductId(@Param('id',ParseIntPipe) id: number){
    const statusCode = HttpStatus.ACCEPTED;
    const FindProduct = await this.productService.findProducId(id,{
      select:{
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        images: true,
        stock: {
          select:{
            id:true,
            cantTotal: true,
            inventorys:{
              select:{
                cant: true,
                branch:{
                  select:{
                    id: true,
                    address: true,
                    lat: true,
                    lng: true,
                    name:true,
                    city:{
                      select:{
                        id:true,
                        name:true,
                      }
                    }
                  }
                }
              }
            }
          }
        },
        status: true,
        categories:{
          select:{
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
    })
    const product = async()=>({
      ...FindProduct,
      images: await Promise.all([this.azureService.getImageUrl(FindProduct.images[0],'imagenes')]),
      createdAt: FindProduct.createdAt.toLocaleString(),
      updatedAt: FindProduct.updatedAt.toLocaleString(),
    })
    return {
      statusCode,
      message: "product id",
      data: {
        product: await product()
      }
    }
  }

  @Patch(':id')
  @Permission("ver producto","editar producto")
  @FormDataRequest({
    storage: MemoryStoredFile
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async updateProduct(@Body() body: UpdateProductDto,@Param('id',ParseIntPipe)id: number,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED
    const userId = req.UserId;
    const product = await this.productService.updateProduct(body,userId,id);
    return {
      statusCode,
      message: `id ${id} product update`,
      data: {
        ...product
      }
    }
  }

  @Delete(':id')
  @Permission("ver producto","eliminar producto")
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteProduct(@Param('id',ParseIntPipe)id: number,@Req() req: Request){
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const product = await this.productService.deleteProduct(id,userId);
    return{
      statusCode,
      message: `product  with id ${id} delete`,
      data: {
        product
      }
    }
  }
} 
