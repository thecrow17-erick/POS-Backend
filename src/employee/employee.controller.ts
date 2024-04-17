import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('atm')
  @UseInterceptors(FileInterceptor(''))
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const statusCode = HttpStatus.CREATED;
    const employee = await this.employeeService.createAtm(createEmployeeDto);
    return {
      statusCode,
      message: "Employee ATM created",
      data: {
        employee
      }
    }
  }

  @Get()
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto) {
    const statusCode = HttpStatus.ACCEPTED;
    const skip = query.skip??0;
    const take = query.limit??Number.MAX_SAFE_INTEGER;
    const total = await this.employeeService.countAll({});
    const employees = await this.employeeService.findAll({
      skip, 
      take,
      select:{
        id: true,
        email: true,
        phone: true,
        rol: true,
        branch: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return {
      statusCode,
      message: "All employees",
      data:{
        total,
        employees
      }
    };
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
