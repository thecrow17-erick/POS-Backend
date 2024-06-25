import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {v4 as uuid} from 'uuid';

import { AzureConnectionService } from 'src/azure-connection/azure-connection.service';
import { PrismaService } from 'src/prisma';
import { ProductCreateDto } from '../dto/create-product.dto';
import { IOptionProducts, IReqCategory } from '../interface';
import { UpdateProductDto } from '../dto';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureService: AzureConnectionService,
    private readonly logService: LogService
  ){}

  async createProduct(createProductoDto: ProductCreateDto,userId:string,tenantId: number){
    const categories: IReqCategory[] = JSON.parse(createProductoDto.categories);
    if(categories.length === 0)
      throw new NotFoundException("categories not found")
    
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
            images: fileName,
            stock:{
              create:{
                cantTotal: 0,
                tenantId
              }
            }
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
      },{
        timeout: 50000000
      })

      this.logService.log({
        accion: `el usuario ${userId} creo el producto ${response.productCreate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Crear producto`,
        username: userId
      })
      

      return response;
    } catch (err) { 
      console.log(err);
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

  async findProducId(id:number,{
    select
  }:IOptionProducts){
    try {
      const findProduct = await this.prisma.product.findUnique({
        where:{
          id
        },
        select,
      })
      if(!findProduct)
        throw new NotFoundException(`Id ${id} not found`);

      return findProduct;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

  async updateProduct(body: UpdateProductDto,userId:string, id:number){
    let categories: IReqCategory[] = [];
    if(body.categories)
      categories = JSON.parse(body.categories);
    try {
      const findProductId = await this.findProducId(id,{});
      
      if(body.name){
        const findProduct = await this.findProduct({
          where:{
            name: body.name,
            id: {
              not: id
            }
          }
        });
        if(findProduct)
          throw new BadRequestException(`product ${findProduct.name} in used`);  
      }
      let fileName: string[];
      if(body.photo)
        fileName = [uuid()+"."+body.photo.extension];
      const response = await this.prisma.$transaction(async(tx)=>{
        if(categories.length > 0){
          await tx.categoryProduct.deleteMany({
            where:{
              productId: findProductId.id
            }
          })
        }
        const updateProduct = await tx.product.update({
          where:{
            id
          },
          data:{
            name: body.name?body.name: findProductId.name,
            description: body.description?body.description: findProductId.description,
            discount: body.discount? body.discount: findProductId.discount,
            price: body.price?body.price: findProductId.price,
            images: body.photo? fileName : findProductId.images,
          }
        });

        if(body.photo){
          const deletePhoto = await this.azureService.deleteImage(findProductId.images[0],"imagenes");
          if(deletePhoto === "error")
            throw new BadRequestException("Error delete photo");

          const addPhoto = await this.azureService.uploadImage(body.photo.buffer, fileName[0], "imagenes");
          if(addPhoto === "error")
            throw new BadRequestException("Error add photo");
        } 

        let categoriesProduct = categories.length === 0 ? 0 : await tx.categoryProduct.createMany({
          data: categories.map(category => ({
            categoryId: +category.id,
            productId: updateProduct.id
          }))
        });
        return {
          updateProduct,
          categories: typeof categoriesProduct === "number"? `${categoriesProduct} categories update` : `${categoriesProduct.count} updated categories`  
        }
      },{
        timeout: 2000000
      })

      this.logService.log({
        accion: `el usuario ${userId} actualizo el producto ${response.updateProduct.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: response.updateProduct.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Actualizar producto`,
        username: userId
      })
      return response;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      if(err instanceof BadRequestException)
        throw err;
      console.log(err);
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

  async deleteProduct(id:number,userId:string){
    try {
      const findProduct = await this.findProducId(id,{});

      const deleteProduct = await this.prisma.product.update({
        where:{
          id
        },
        data:{
          status: !findProduct.status
        },
      });
      this.logService.log({
        accion: `el usuario ${userId} ${deleteProduct.status? "activo":"desactivo"} el producto ${deleteProduct.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: deleteProduct.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `${deleteProduct.status? "Activar":"Desactivar"} producto`,
        username: userId
      })
      return deleteProduct;
    }catch (err) {
      console.log(err);
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }

}
