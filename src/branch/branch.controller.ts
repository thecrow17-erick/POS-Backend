import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  async create(@Body() createBranchDto: CreateBranchDto) {
    const statusCode = HttpStatus.CREATED;
    const branch = await this.branchService.create(createBranchDto);
    return {
      statusCode,
      message: "Branch created",
      data: {
        branch
      }
    }
  }

  @Get()
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto) {
    const statusCode = HttpStatus.OK;
    const skip = query.skip??0;
    const take = query.limit??Number.MAX_SAFE_INTEGER;
    const branchs = await this.branchService.findAll(
      {
        skip,
        take,
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
    })
    const total = await this.branchService.countAll({})
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
