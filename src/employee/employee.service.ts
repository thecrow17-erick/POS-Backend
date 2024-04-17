import {  BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma';
import { NodemailersService } from 'src/nodemailers';
import {v4 as uuid} from 'uuid';
import { IOptionEmployees } from './interface';

@Injectable()
export class EmployeeService {

  constructor(
    private readonly prisma:PrismaService, 
    private readonly mailerService: NodemailersService
  ){}

  async createAtm(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employeeExist = await this.findEmployeeAtm({
        where:{
          OR:[
            {
              email: createEmployeeDto.email,
            },
            {
              phone: createEmployeeDto.phone,
            }
          ]
        }
      })
      if(employeeExist) throw new BadRequestException("employee in system")
      
      const response = await this.prisma.$transaction(async(t) => {
        const employeeCreateAtm = await t.employee.create({
          data:{
            ...createEmployeeDto,
            rol: "Empleado",
            branchId: +createEmployeeDto.branchId,
            codeEmployee: uuid().replace(/-/g, "").substring(0,12),
          }
        })
        const sendEmailEmployee = await this.mailerService.sendMailEmployeeAtm({
          codigo: employeeCreateAtm.codeEmployee,
          email: employeeCreateAtm.email,
          name: employeeCreateAtm.name
        })

        console.log(sendEmailEmployee);
        
        return employeeCreateAtm;
      })

      return response;
    } catch (err) {
      if(err instanceof BadRequestException) throw err;

      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async countAll({
    where,
    cursor,
    orderBy
    } : IOptionEmployees
    ) {
    try {
      const employees = await this.prisma.employee.count({
        where,
        cursor,
        orderBy,
      });
      return employees;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findAll(
    {
    orderBy,
    skip,
    take,
    where,
    cursor
    }: IOptionEmployees
    ) {
    try {
      const employees = await this.prisma.employee.findMany({
        where,
        skip,
        take,
        cursor,
        orderBy,
      });
      return employees;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findEmployeeAtm({
    where
  }:IOptionEmployees
  ){
    try {
      const userAtm = await this.prisma.employee.findFirst({
        where
      })
      return userAtm;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  findOne(msg:string) {
    // const ugu = this.mailerService.sendMailPrueba(msg)
    return 'dsadsa';
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
