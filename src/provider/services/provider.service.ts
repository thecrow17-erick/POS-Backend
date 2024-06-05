import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { IOptionProviders } from '../interface';
import { ProviderCreateDto } from '../dto';
import { ProviderUpdateDto } from '../dto/update-provider.dto';
import { LogService } from '../../log/service/log.service';

@Injectable()
export class ProviderService {

  constructor(
    private readonly prisma : PrismaService,
    private readonly logService:LogService
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

  async createProvider(body: ProviderCreateDto,userId:string, tenantId: number){
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
      this.logService.log({
        accion: `el usuario ${userId} creo un proveedor ${providerCreate.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Crear proveedor`,
        username: userId
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

  async updateProvider(body: ProviderUpdateDto,userId:string, id: string){
    try {
      const findProvider = await this.findIdProvider(id, {});

      const updateProvider = await this.prisma.provider.update({
        where:{
          id:findProvider.id
        },
        data: body
      })

      this.logService.log({
        accion: `el usuario ${userId} actualizo un proveedor ${updateProvider.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: updateProvider.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `Actualizar proveedor`,
        username: userId
      })
      return updateProvider;
    }catch(err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }

  async deleteProvider(id: string,userId:string){
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
      this.logService.log({
        accion: `el usuario ${userId} ${deletProvider.status? "activo":"desactivo"} un proveedor ${deletProvider.id}`,
        fechaHora: new Date().toLocaleString(),
        idTenant: deletProvider.tenantId.toString(),
        idUsuario: userId,
        ipAddress: "170.20.1.2",
        message: `${deletProvider.status? "Activar":"Desactivar"} proveedor`,
        username: userId
      })
      return deletProvider;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
    }
  }
}
