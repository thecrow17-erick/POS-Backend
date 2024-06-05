import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services';
import { QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Permission } from 'src/auth/decorators';

@Controller('category')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class CategoryController {

  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permission("ver categoria")
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
  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission("create category")
  async createCategory(@Body() body: CreateCategoryDto,@Req() req: Request){
    const tenantId = req.tenantId;
    const statusCode = HttpStatus.OK
    const userId = req.UserId;
    const category = await this.categoryService.createCategory(body,userId,tenantId);

    return {
      statusCode,
      message: "category created",
      data: {
        category
      }
    }
  }

  @Get(":id")
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission("ver categoria")
  async findCategory(@Param('id', ParseIntPipe) id:number){
    const statusCode = HttpStatus.ACCEPTED;
    const category = await this.categoryService.findCategoryId(id)
    return {
      statusCode,
      message: "Category",
      data:{
        category
      }
    }
  }
  
  @Patch(":id")
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission("editar categoria","ver categoria")
  async updateCategory(@Param('id', ParseIntPipe) id:number,@Body() body:UpdateCategoryDto,@Req() req: Request){
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const category = await this.categoryService.updateCategory(id,userId,body)

    return {
      statusCode,
      message: "update category",
      data:{
        category
      }
    }
  }

  @Delete(":id")
  @Permission("ver categoria","eliminar categoria")
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteCategory(@Param('id', ParseIntPipe) id:number,@Req() req: Request){
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const category = await this.categoryService.deleteCategory(id,userId)
    return {
      statusCode,
      message: "update category",
      data:{
        category
      }
    }
  }
}
