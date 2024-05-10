import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {v4 as uuid} from 'uuid';

import { AzureConnectionService } from 'src/azure-connection/azure-connection.service';
import { PrismaService } from 'src/prisma';
import { ProductCreateDto } from '../dto/create-product.dto';
import { IOptionProducts, IReqCategory } from '../interface';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureService: AzureConnectionService
  ){}

  async createProduct(createProductoDto: ProductCreateDto,tenantId: number){
    const categories: IReqCategory[] = JSON.parse(createProductoDto.categories);
    try {
      const findProduct = await this.findProduct({
        where:{
          AND:[
            {
              name: createProductoDto.name,
            },
            {
              tenantId
            }
          ]
        }
      })
      if(findProduct)
        throw new BadRequestException(`product ${findProduct.name} in used`);

      const fileName = [uuid()+"."+createProductoDto.photo.extension];
      const response = await this.prisma.$transaction(async(tx)=>{
        const productCreate = await tx.product.create({
          data:{
            name: createProductoDto.name,
            description: createProductoDto.description,
            price: createProductoDto.price,
            discount: createProductoDto.discount,
            tenantId,
            images: fileName
          }
        });

        const findCategories = await tx.category.findMany({
          where: {
            OR: categories.map(category => ({id: +category.id})),
          }
        });
        if(!findCategories)
          throw new NotFoundException("categories not Found");
        
        const productCategories = await tx.categoryProduct.createMany({
          data: categories.map((category)=>({
            categoryId: +category.id,
            productId: productCreate.id
          })),
        });
        const uploadFile = await this.azureService.uploadImage(createProductoDto.photo.buffer,fileName[0],"imagenes");
        if(uploadFile === "error")
          throw new BadRequestException(`Product ${productCreate.name} not create`);

        return {
          productCreate,
          categories: `${productCategories.count} inserted at product`
        }
      })

      return response;
    } catch (err) { 
      if(err instanceof BadRequestException)
        throw err;
      if(err instanceof NotFoundException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async findAllProducts({
    where,
    skip,
    take,
    select,
    orderBy
  }: IOptionProducts){
    try {
      const allProducts = await this.prisma.product.findMany({
        where,
        skip,
        select,
        orderBy,
        take
      })

      return allProducts;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

  async countProduct({
    where
  }: IOptionProducts){
    try {
      const allProducts = await this.prisma.product.count({
        where
      })

      return allProducts;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

  async findProduct({
    where
  }:IOptionProducts){
    try {
      const findProduct = await this.prisma.product.findFirst({
        where
      })
      return findProduct;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

}
