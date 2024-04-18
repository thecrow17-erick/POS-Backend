import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, Res } from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Response } from 'express';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async create(@Body() createCityDto: CreateCityDto, @Res() res: Response) {
    const statusCode = HttpStatus.CREATED;
    const city = await this.cityService.create(createCityDto);
    return res.status(statusCode).json({
      statusCode,
      message: "city created",
      data: {
        city
      }
    })
  }

  @Get()
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Res() res: Response) {
    const statusCode = HttpStatus.OK;
    const skip = query.skip??0;
    const take = query.limit??Number.MAX_SAFE_INTEGER;
    const total = await this.cityService.countAll({});
    const citys = await this.cityService.findAll({
      skip, 
      take,
    });
    return res.status(statusCode).json({
      statusCode,
      message: "All Citys",
      data:{
        total,
        citys
      }
    });
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
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateCityDto: UpdateCityDto, @Res() res: Response) {
    const statusCode = HttpStatus.ACCEPTED;
    const city = await this.cityService.update(id, updateCityDto);
    return res.status(statusCode).json({
      statusCode,
      message: "city updated",
      data: {
        city
      }
    })
  }

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Res() res: Response) {
    const statusCode = HttpStatus.ACCEPTED;
    const city = await this.cityService.remove(id);
    return res.status(statusCode).json({
      statusCode,
      message: "city updated",
      data: {
        city
      }
    })
  }
}
