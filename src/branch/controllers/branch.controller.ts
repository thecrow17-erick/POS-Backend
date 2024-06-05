import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, Res, HttpCode, UseGuards, Req } from '@nestjs/common';
import { BranchService } from '../services';
import { CreateBranchDto,UpdateBranchDto } from '../dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';

@Controller('branch')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @Permission("crear sucursal")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBranchDto: CreateBranchDto, @Req() req: Request) {
    const tenantId = req.tenantId;
    const statusCode = HttpStatus.CREATED;
    const userId = req.UserId;
    const branch = await this.branchService.create(createBranchDto,userId,tenantId);
    return {
      statusCode,
      message: "Branch created",
      data: {
        branch
      }
    }
  }

  @Get()
  @Permission("ver sucursal")
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
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

  @Get(':id')
  @Permission("ver sucursal")
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id',ParseIntPipe) id: number) {
    const statusCode = HttpStatus.OK;
    const branch = await this.branchService.findOne(id,{
      select:{
        id: true,
        name: true,
        address: true,
        lat: true,
        lng: true,
        city: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        Tenant: true,
        atm: true
      }
    });
    const findBranch = {
      ...branch,
      createdAt: branch.createdAt.toLocaleString(),
      updatedAt: branch.updatedAt.toLocaleString()
    }
    return {
      statusCode,
      message: "Branch for id",
      data:{
        branch:findBranch
      }
    }
  }

  @Patch(':id')
  @Permission("ver sucursal", "editar sucursal")
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateBranchDto: UpdateBranchDto, @Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const branch = await this.branchService.update(id,userId,updateBranchDto);
    return {
      statusCode,
      message: "Branch updated",
      data: {
        branch
      }
    }
  }

  @Delete(':id')
  @Permission("ver sucursal", "eliminar sucursal")
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id',ParseIntPipe) id: number, @Req() req: Request) {
    const statusCode = HttpStatus.ACCEPTED;
    const userId = req.UserId;
    const branch = await this.branchService.remove(id,userId);
    return {
      statusCode,
      message: "Branch updated",
      data: {
        branch
      }
    }  
  }
}
