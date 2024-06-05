import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, Res, Req, HttpCode, UseGuards } from '@nestjs/common';
import { CityService } from '../services';
import { CreateCityDto,UpdateCityDto } from '../dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Request, Response } from 'express';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';

@Controller('city')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @Permission("crear ciudad")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCityDto: CreateCityDto, @Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const city = await this.cityService.create(createCityDto,userId,tenantId);
    return {
      statusCode,
      message: "city created",
      data: {
        city
      }
    }
  }
  
  @Get()
  @Permission("ver ciudad")
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,skip,search} = query;
    const [citys,total] = await Promise.all([
      this.cityService.findAll({
        where:{
          name: {
            contains: search,
            mode: "insensitive"
          },
          tenantId
        },
        skip, 
        take:limit,
      }),
      await this.cityService.countAll({
        where:{
          name: {
            contains: search,
            mode: "insensitive"
          },
          tenantId
        },
      })
    ])
    
    return{
      statusCode,
      message: "All Citys",
      data:{
        total,
        citys
      }
    }
  }

  @Get(':id')
  @Permission("ver ciudad")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id',ParseIntPipe) id: number, @Res() res: Response) {
    console.log(id);
    const statusCode = HttpStatus.ACCEPTED;
    const city = await this.cityService.findOne(id,{});
    return res.status(statusCode).json({
      statusCode,
      message: "city datsas",
      data: {
        city
      }
    })
  }

  @Patch(':id')
  @Permission("ver ciudad","editar ciudad")
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateCityDto: UpdateCityDto,@Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const city = await this.cityService.update(id,userId, updateCityDto);
    return{
      statusCode,
      message: "city updated",
      data: {
        city
      }
    }
  }

  @Delete(':id')
  @Permission("ver ciudad","eliminar ciudad")
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id',ParseIntPipe) id: number,@Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const city = await this.cityService.remove(id,userId);
    return {
      statusCode,
      message: "city updated",
      data: {
        city
      }
    }
  }
}
