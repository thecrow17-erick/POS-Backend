import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, Res, Req, HttpCode } from '@nestjs/common';
import { CityService } from '../services';
import { CreateCityDto,UpdateCityDto } from '../dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Request, Response } from 'express';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCityDto: CreateCityDto, @Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const city = await this.cityService.create(createCityDto,tenantId);
    return {
      statusCode,
      message: "city created",
      data: {
        city
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,skip} = query;
    const [citys,total] = await Promise.all([
      this.cityService.findAll({
        skip, 
        take:limit,
      }),
      await this.cityService.countAll({
        where:{
          tenantId
        }
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
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateCityDto: UpdateCityDto) {
    const statusCode = HttpStatus.ACCEPTED;
    const city = await this.cityService.update(id, updateCityDto);
    return{
      statusCode,
      message: "city updated",
      data: {
        city
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id',ParseIntPipe) id: number) {
    const statusCode = HttpStatus.ACCEPTED;
    const city = await this.cityService.remove(id);
    return {
      statusCode,
      message: "city updated",
      data: {
        city
      }
    }
  }
}
