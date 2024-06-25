import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionInventory } from '../interface';

@Injectable()
export class InventoryService {

  constructor(
    private readonly prisma: PrismaService,
  ){}

  async findAllInventory({
    where,
    skip,
    take,
    select,
    orderBy
  }: IOptionInventory){
    try {
      const allProducts = await this.prisma.inventory.findMany({
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

  async countInventory({
    where
  }: IOptionInventory){
    try {
      const allProducts = await this.prisma.inventory.count({
        where
      })

      return allProducts;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`);
    }
  }
}
