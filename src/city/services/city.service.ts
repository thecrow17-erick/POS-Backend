import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCityDto,UpdateCityDto } from '../dto';
import { PrismaService } from 'src/prisma';
import { IOptionCitys } from '../interface';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class CityService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ){}

  async create(createCityDto: CreateCityDto,userId: string,tenantId: number) {
    try {
      const cityExist = await this.findCity({
        where:{
          name: createCityDto.name
        }
      })
      if(cityExist) throw new BadRequestException("city in system");

      const cityCreate = await this.prisma.city.create({
        data: {
          name: createCityDto.name,
          tenantId
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} creo la ciudad ${cityCreate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: "crear ciudad",
        username: userId
      })
      return cityCreate;
    } catch (err) {
      if(err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findAll({
    orderBy,
    skip,
    take,
    where,
    cursor,
    select
    }: IOptionCitys
    ) {
    try {
      const citys = await this.prisma.city.findMany({
        where,
        skip,
        take,
        cursor,
        orderBy,
        select
      });
      return citys;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async countAll({
    where,
    cursor,
    orderBy
    } : IOptionCitys
    ) {
    try {
      const employees = await this.prisma.city.count({
        where,
        cursor,
        orderBy,
      });
      return employees;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }
  async findOne(id: number, {select}:IOptionCitys ) {
    try {
      const cityFind = await this.prisma.city.findUnique({
        where:{
          id
        },
        select
      })
      
      if(!cityFind) throw new NotFoundException("city not found")

      return cityFind;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findCity({
    where
  }:IOptionCitys){
    try {
      const findCity = await this.prisma.city.findFirst({
        where
      })

      return findCity;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async update(id: number,userId:string, updateCityDto: UpdateCityDto) {
    try {
      const cityfind = await this.findOne(id,{});
      if(!cityfind) throw new NotFoundException("Id not found")

      const cityUpdate = await this.prisma.city.update({
        where:{
          id
        },
        data: updateCityDto
      })
      this.logService.log({
        accion: `el usuario ${userId} actualizo la ciudad ${cityUpdate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: cityUpdate.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: "Actualizar ciudad",
        username: userId
      })
      return cityUpdate;

    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
    
  }

  async remove(id: number,userId:string) {
    try {
      const cityfind = await this.findOne(id,{});
      if(!cityfind) throw new NotFoundException("Id not found")

      const cityUpdate = await this.prisma.city.update({
        where:{
          id
        },
        data: {
          status: !cityfind.status
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} ${cityUpdate.status? "activo": "desactivo"} la ciudad ${cityUpdate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: cityUpdate.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `${cityUpdate.status? "Activar": "Desactivar"} ciudad`,
        username: userId
      })

      return cityUpdate;

    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
    
  }
}
