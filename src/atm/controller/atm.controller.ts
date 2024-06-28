import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, Res, ParseIntPipe, UseGuards, HttpCode, Req } from '@nestjs/common';
import { AtmService } from '../services'
import { CreateAtmDto , UpdateAtmDto } from '../dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';
import { BranchService } from 'src/branch/services';

@Controller('atm')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class AtmController {
  constructor(
    private readonly atmService: AtmService,
    private readonly branchService: BranchService
  ) {}

  @Get('branch')
  @Permission("crear cajero")
  @HttpCode(HttpStatus.OK)
  async findAllBranchs(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const { limit,skip,search} = query;
    const tenantId = req.tenantId;
    const [branchs,total] = await Promise.all([
      this.branchService.findAll(
        {
          where:{
            tenantId,
            name:{
              contains: search,
              mode: "insensitive"
            }
          },
          skip,
          take: limit,
          select:{
            id: true,
            address: true,
            status: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            city:true
          }
      }),
      this.branchService.countAll({
        where:{
          tenantId,
          name:{
            contains: search,
            mode: "insensitive"
          }
        }
      })
    ])

    const allBranchs = branchs.map(branch => ({
      ...branch,
      createdAt: branch.createdAt.toLocaleString(),
      updatedAt: branch.updatedAt.toLocaleString()
    }))

    return {
      statusCode,
      message: "All branchs",
      data: {
        total,
        branchs: allBranchs
      }
    }
  }

  @Post()
  @Permission("crear cajero")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAtmDto: CreateAtmDto, @Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    const atm = await this.atmService.create(createAtmDto,userId,tenantId);
    return {
      statusCode,
      message: "atm created",
      data: {
        atm
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permission("ver cajero")
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const {limit,skip,search} = query;
    const tenantId = req.tenantId;
    const [atms, total] = await Promise.all([
      this.atmService.findAll(
        {       
          where:{
            tenantId,
            name:{
              contains: search,
              mode: "insensitive"
            }
          },
          skip,
          take:limit,
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
      }),
      this.atmService.countAll({
        where:{
          tenantId,
          name:{
            contains: search,
            mode: "insensitive"
          }
        }
      })
    ])

    const allAtms = atms.map(atm => ({
      ...atm,
      createdAt: atm.createdAt.toLocaleString(),
      updatedAt: atm.updatedAt.toLocaleString(),
    }))

    return {
      statusCode,
      message: "All atm",
      data: {
        total,
        atms:allAtms
      }
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Permission("ver cajero")
  async findOne(@Param('id',ParseIntPipe) id: number) {
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
    return {
      statusCode,
      message: "Atm for id",
      data:{
        atm
      }
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission("ver cajero","editar cajero")
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateAtmDto: UpdateAtmDto, @Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const atm = await this.atmService.update(id,userId,updateAtmDto);
    return {
      statusCode,
      message: "atm updated",
      data: {
        atm
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @Permission("ver cajero","eliminar cajero")
  async remove(@Param('id',ParseIntPipe) id: number, @Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const atm = await this.atmService.remove(id,userId);
    return {
      statusCode,
      message: "atm delete",
      data: {
        atm
      }
    }
  }
}
