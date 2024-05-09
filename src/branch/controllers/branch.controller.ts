import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, Res, HttpCode, UseGuards, Req } from '@nestjs/common';
import { BranchService } from '../services';
import { CreateBranchDto,UpdateBranchDto } from '../dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';
import { Request } from 'express';
import { TenantGuard } from 'src/auth/guard';

@Controller('branch')
@UseGuards(TenantGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBranchDto: CreateBranchDto, @Req() req: Request) {
    const tenantId = req.tenantId;
    const statusCode = HttpStatus.CREATED;
    const branch = await this.branchService.create(createBranchDto,tenantId);
    return {
      statusCode,
      message: "Branch created",
      data: {
        branch
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const { limit,skip} = query;
    const tenantId = req.tenantId;
    const [branchs,total] = await Promise.all([
      this.branchService.findAll(
        {
          where:{
            tenantId
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
            city:{
              select:{
                id: true,
                name: true
              }
            }
          }
      }),
      this.branchService.countAll({})
    ])
    return {
      statusCode,
      message: "All branchs",
      data: {
        total,
        branchs
      }
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id',ParseIntPipe) id: number) {
    const statusCode = HttpStatus.OK;
    const branch = await this.branchService.findOne(id,{});
    return {
      statusCode,
      message: "Branch for id",
      data:{
        branch
      }
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateBranchDto: UpdateBranchDto) {
    const statusCode = HttpStatus.ACCEPTED;
    const branch = await this.branchService.update(id,updateBranchDto);
    return {
      statusCode,
      message: "Branch updated",
      data: {
        branch
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async remove(@Param('id',ParseIntPipe) id: number) {
    const statusCode = HttpStatus.ACCEPTED;
    const branch = await this.branchService.remove(id);
    return {
      statusCode,
      message: "Branch updated",
      data: {
        branch
      }
    }  
  }
}
