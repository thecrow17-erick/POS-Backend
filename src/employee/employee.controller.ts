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
    return {
      statusCode,
      message: "Employee ATM created",
      data: await this.employeeService.createAtm(createEmployeeDto)
    }
  }

  @Get()
  async findAll(@Query(new ParseQueryPipe()) query: QueryCommonDto) {
    console.log(query);
    
    const statusCode = HttpStatus.ACCEPTED;
    const total = await this.employeeService.countAll({});
    const employees = await this.employeeService.findAll({
      skip:query.skip??undefined, 
      take: query.limit??undefined,
      select:{
        id: true,
        email: true,
        phone: true,
        rol: true,
        createdAt: true,
        updatedAt: true
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
