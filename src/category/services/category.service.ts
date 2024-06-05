import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionCategories } from '../interface';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class CategoryService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService
  ){}
  
  async allCategories({
    where,
    select,
    orderBy,
    skip,
    take
  }:IOptionCategories){
    try {
      const categories = await this.prisma.category.findMany({
        where,
        select,
        orderBy,
        skip,
        take
      })

      return categories
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async countCategory({
    where
  }:IOptionCategories){
    try {
      const countCategories = await this.prisma.category.count({
        where
      })

      return countCategories
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async createCategory(createCategoryDto: CreateCategoryDto,userId: string,tenantId: number){
    try {
      const findCategory = await this.prisma.category.findFirst({
        where:{
          description: createCategoryDto.description
        }
      })
      if(findCategory)
        throw new BadRequestException(`category ${findCategory.description} in used`)

      const categoryCreate = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
          tenantId
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} creo la categoria ${categoryCreate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.10.2.1",
        message: "crear categoria",
        username: userId
      })
      return categoryCreate;

    } catch (err) {
      if(err instanceof BadRequestException)
        throw err
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async findCategory({
    where
  }:IOptionCategories){
    try {
      const findCategory = await this.prisma.category.findFirst({
        where
      })
      return findCategory;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  } 

  async findCategoryId(id:number){
    try {
      const findCategory = await this.prisma.category.findUnique({
        where:{
          id
        }
      })
      if(!findCategory)
        throw new NotFoundException(`id ${id} category not found `)
      return findCategory;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async updateCategory(id:number,userId: string,updateCategoryDto: UpdateCategoryDto){
    try {
      const findCategory = await this.findCategory({
        where: updateCategoryDto
      })
      if(findCategory)
        throw new BadRequestException(`category ${findCategory.description} in used`)
      
      const updateCategory = await this.prisma.category.update({
        where:{
          id
        },
        data: updateCategoryDto
      })
      this.logService.log({
        accion: `el usuario ${userId} actualizo la categoria ${updateCategory.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: updateCategory.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.10.2.1",
        message: "crear categoria",
        username: userId
      })
      return updateCategory;

    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async deleteCategory(id:number,userId: string){
    try {
      const findCategory =await this.findCategoryId(id);

      const deleteCategory = await this.prisma.category.update({
        where:{
          id:findCategory.id
        },
        data:{
          status: !findCategory.status 
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} ${deleteCategory.status? "activo": "desactivo"} la categoria ${deleteCategory.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: deleteCategory.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.10.2.1",
        message: `${deleteCategory.status? "Activo": "Desactivo"} la categoria`,
        username: userId
      })
      return deleteCategory;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
    }
  }
}

