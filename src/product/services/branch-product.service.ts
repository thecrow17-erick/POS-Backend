import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AddBranchProductDto } from '../dto';
import { BranchService } from 'src/branch/services';
import { ProductService } from './product.service';
import { IOptionStock } from '../interface';

@Injectable()
export class BranchProductService {

  constructor(
    private readonly prisma: PrismaService, 
    private readonly branchService: BranchService,
    private readonly productService: ProductService,
  ){}

  async findAllStock({
    where,
    select,
    skip,
    take,
    orderBy
  }:IOptionStock){
    try{
      const allProducts = await this.prisma.stock.findFirst({
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
  async countStock({
    where,
  }:IOptionStock){
    try{
      const allProducts = await this.prisma.stock.count({
        where,
      })
      return allProducts;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }
  async addProductBranch(productId: number, branchs: AddBranchProductDto, tenantId: number){
    try {
      const findBranchs = await this.branchService.findAll({
        where:{
          id: {
            in: branchs.branchIds,
          },
          tenantId
        }
      })
      if(findBranchs.length !== branchs.branchIds.length)
        throw new BadRequestException("Hay sucursales que no estan disponibles")
      console.log(productId)
      const findProduct = await this.productService.findProducId(productId,{
        select:{
          id: true,
          stock: true,
        }
      });
      console.log(findProduct.stock)
      const createInventories = await this.prisma.inventory.createMany({
        data: findBranchs.map(branch => ({
          branchId: branch.id,
          cant: 0,
          stockId: findProduct.stock.id
        })),
      })

      return `El producto ${findProduct.id} se agrego en ${createInventories.count} sucursales`
    } catch (err) {

      console.log(err)
      if(err instanceof BadRequestException)
        throw err
      if(err instanceof NotFoundException)
        throw err

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }
}
