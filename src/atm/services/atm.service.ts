import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAtmDto,UpdateAtmDto } from '../dto';
import { IOptionAtm } from '../interface';
import { PrismaService } from 'src/prisma';
import { BranchService } from 'src/branch/services';
import { LogService } from 'src/log/service/log.service';

@Injectable()
export class AtmService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly branchService: BranchService,
    private readonly logService: LogService
  ){}

  async create(createAtmDto: CreateAtmDto, userId: string,tenantId: number) {
    try {
      //pregunto si existe el id del branch
      await this.branchService.findOne(createAtmDto.branchId,{});
      //creo La caja
      const atmCreated = await this.prisma.atm.create({
        data: {
          ...createAtmDto,
          tenantId
        }
      })
      this.logService.log({
        accion: `el usuario ${userId} creo una caja ${atmCreated.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario:userId,
        ipAddress: "172.10.2.1",
        message: "creacion de caja",
        username: userId
      })

      return atmCreated;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }



  async countAll({
    where,
    cursor,
    orderBy
    } : IOptionAtm
    ) {
    try {
      const employees = await this.prisma.atm.count({
        where,
        cursor,
        orderBy,
      });
      return employees;
    } catch (err) {
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
    }: IOptionAtm
    ) {
    try {
      const branchs = await this.prisma.atm.findMany({
        where,
        skip,
        take,
        cursor,
        orderBy,
        select
      });
      return branchs;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findAtm({
    where
  }:IOptionAtm){
    try {
      const findBranch = await this.prisma.atm.findFirst({
        where
      })

      return findBranch;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findOne(id: number,{select}:IOptionAtm ) {
    try {
      const branchFind = await this.prisma.atm.findUnique({
        where:{
          id
        },
        select
      })
      
      if(!branchFind) throw new NotFoundException("branch not found")

      return branchFind;
    } catch (err) {
      if(err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async update(id: number,userId: string, updateAtmDto: UpdateAtmDto) {
    try {
      //pregunto si el id del atm existe
      await this.findOne(id,{});
      //actualizo 
      const atmUpdate = await this.prisma.atm.update({
        where:{
          id
        },
        data: updateAtmDto
      })

      this.logService.log({
        accion: `el usuario ${userId} actualizo una caja ${atmUpdate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: atmUpdate.tenantId.toString(),
        idUsuario:userId,
        ipAddress: "172.10.2.1",
        message: "actualizacion de caja",
        username: userId
      })
      return atmUpdate;
    } catch (err) {
      if(err instanceof NotFoundException)  throw err;
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async remove(id: number,userId: string) {
    try {
      const findAtm = await this.findOne(id,{});
      //ahora si actualizo
      const branchUpdate = await this.prisma.atm.update({
        where:{
          id
        },
        data: {
          status: !findAtm.status
        }
      });

      this.logService.log({
        accion: `el usuario ${userId} ${branchUpdate.status ? "activo":"desactivo"} una caja ${branchUpdate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: branchUpdate.tenantId.toString(),
        idUsuario:userId,
        ipAddress: "172.10.2.1",
        message: "actualizacion de caja",
        username: userId
      })
      return branchUpdate;

    } catch (err) {
      if(err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }
}
