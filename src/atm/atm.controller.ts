import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, Res, ParseIntPipe } from '@nestjs/common';
import { AtmService } from './atm.service';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Response } from 'express';

@Controller('atm')
export class AtmController {
  constructor(private readonly atmService: AtmService) {}

  @Post()
  async create(@Body() createAtmDto: CreateAtmDto, @Res() res: Response) {
    const statusCode = HttpStatus.CREATED;
    const atm = await this.atmService.create(createAtmDto);
    return res.status(statusCode).json({
      statusCode,
      message: "atm created",
      data: {
        atm
      }
    })
  }

  @Get()
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Res() res: Response) {
    const statusCode = HttpStatus.OK;
    const skip = query.skip??0;
    const take = query.limit??Number.MAX_SAFE_INTEGER;
    const atms = await this.atmService.findAll(
      {
        skip,
        take,
        select:{
          id: true,
          name: true,
          status: true,
          branch: {
            select:{
              id: true,
              name: true,
              address: true,
              city: {
                select:{
                  id: true,
                  name: true
                }
              },
            }
          },
          createdAt: true,
          updatedAt: true
        }
    })
    const total = await this.atmService.countAll({})
    return res.status(statusCode).json({
      statusCode,
      message: "All atm",
      data: {
        total,
        atms
      }
    })
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number, @Res() res: Response) {
    const statusCode = HttpStatus.OK;
    const atm = await this.atmService.findOne(id,{
      select:{
        id: true,
        name: true,
        branch: {
          select: {
            id: true,
            name: true,
            city:{
              select:{
                id: true,
                name: true
              }
            }
          }
        },
        status: true,
        createdAt: true,
        updatedAt: true,

      }
    });
    console.log(atm.createdAt.toLocaleString());
    
    return res.status(statusCode).json({
      statusCode,
      message: "Atm for id",
      data:{
        atm
      }
    })
  }

  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateAtmDto: UpdateAtmDto, @Res() res: Response) {
    const statusCode = HttpStatus.ACCEPTED;
    const atm = await this.atmService.update(id,updateAtmDto);
    return res.status(statusCode).json({
      statusCode,
      message: "atm updated",
      data: {
        atm
      }
    })
  }

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Res() res: Response) {
    const statusCode = HttpStatus.ACCEPTED;
    const atm = await this.atmService.remove(id);
    return res.status(statusCode).json({
      statusCode,
      message: "atm delete",
      data: {
        atm
      }
    })
  }
}
