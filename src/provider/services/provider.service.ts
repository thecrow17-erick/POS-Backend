import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionProviders } from '../interface';
import { ProviderCreateDto } from '../dto';
import { ProviderUpdateDto } from '../dto/update-provider.dto';

@Injectable()
export class ProviderService {

  constructor(
    private readonly prisma : PrismaService,
  ){}


  async findAllProviders({
    where,
    skip,
    take,
    select
  }:IOptionProviders){
    try {
      const allProviders = await this.prisma.provider.findMany({
        where,
        skip,
        take,
        select
      })
      return allProviders;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async countProvider({
    where
  }:IOptionProviders){
    try {
      const count=  await this.prisma.provider.count({
        where
      })
      return count;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async findProvider({
    where
  }:IOptionProviders){
    try {
      const count =  await this.prisma.provider.findFirst({
        where
      })
      return count;
    } catch (err) {
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async createProvider(body: ProviderCreateDto, tenantId: number){
    try {
      const findProvider = await this.findProvider({
        where:{
          OR: [
            {
              phone: body.phone,
            },
            {
              email: body.email,
            }
          ]
        }
      })

      if (findProvider) 
        throw new BadRequestException(`provider ${findProvider.name} is used`)

      const providerCreate = await this.prisma.provider.create({
        data:{
          ...body,
          tenantId
        }
      })
      return providerCreate;
    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async findIdProvider(id: string, {
    select
  }:IOptionProviders){
    try {
      const findProvider = await this.prisma.provider.findUnique({
        where:{
          id
        },
        select
      })
      if(!findProvider)
        throw new NotFoundException(`id ${id} provider not found`)
      return findProvider;
    } catch (err) {
      if (err instanceof NotFoundException)
        throw err;
      
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async updateProvider(body: ProviderUpdateDto, id: string){
    try {
      const findProvider = await this.findIdProvider(id, {});

      const updateProvider = await this.prisma.provider.update({
        where:{
          id:findProvider.id
        },
        data: body
      })

      return updateProvider;
    }catch(err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async deleteProvider(id: string){
    try {
      const findProvider = await this.findIdProvider(id, {});

      const deletProvider= await this.prisma.provider.update({
        where:{
          id: findProvider.id
        },
        data:{
          status: !findProvider.status
        }
      })

      return deletProvider;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }
}
