import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBranchDto,UpdateBranchDto } from '../dto';
import { PrismaService } from 'src/prisma';
import { IOptionBranch } from '../interface';
import { CityService } from 'src/city/services';

@Injectable()
export class BranchService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly cityService: CityService
  ){}

  async create(createBranchDto: CreateBranchDto,tenantId: number) {
    try {
      await this.cityService.findOne(createBranchDto.cityId,{});
      //si existe seguimos pregutnando por los otros datos
      const branchExist = await this.findBranch({
        where:{
          OR: [
            {
              address: createBranchDto.address,
            },{
              name: createBranchDto.name,
            }
          ]
        }
      })
      if(branchExist) throw new BadRequestException("Branch office in system")
      //ya si todo esta bien lo creo
      const branchCreate = await this.prisma.branch.create({
        data: {
          ...createBranchDto,
          tenantId
        }
      })
      
      return branchCreate;

    } catch (err) {
      if(err instanceof BadRequestException) throw err;
      if(err instanceof NotFoundException) throw err;

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
    }: IOptionBranch
    ) {
    try {
      const branchs = await this.prisma.branch.findMany({
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

  async countAll({
    where,
    cursor,
    orderBy
    } : IOptionBranch
    ) {
    try {
      const employees = await this.prisma.branch.count({
        where,
        cursor,
        orderBy,
      });
      return employees;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findOne(id: number,{select}:IOptionBranch ) {
    try {
      const branchFind = await this.prisma.branch.findUnique({
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

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    try {
      await this.findOne(id,{});

      //ahora si pregunto si los datos no se parecen a otro
      const branchExist = await this.findBranch({
        where:{
          OR: [
            {
              address: updateBranchDto.address,
            },{
              name: updateBranchDto.name,
            }
          ]
        }
      })
      if(branchExist && id !== branchExist.id) throw new BadRequestException("Branch office in system")
      //ahora si actualizo
      const branchUpdate = await this.prisma.branch.update({
        where:{
          id
        },
        data: updateBranchDto
      });

      return branchUpdate;

    } catch (err) {
      if(err instanceof BadRequestException) throw err;
      if(err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async findBranch({
    where
  }:IOptionBranch){
    try {
      const findBranch = await this.prisma.branch.findFirst({
        where
      })

      return findBranch;
    } catch (err) {
      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id,{});
      //ahora si actualizo
      const branchUpdate = await this.prisma.branch.update({
        where:{
          id
        },
        data: {
          status: false
        }
      });
      return branchUpdate;

    } catch (err) {
      if(err instanceof NotFoundException) throw err;

      throw new InternalServerErrorException(`Internal server error $${JSON.stringify(err)}`);
    }
  }
}
