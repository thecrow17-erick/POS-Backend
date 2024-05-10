import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TenantGuard } from 'src/auth/guard';
import { QueryCommonDto } from 'src/common';
import { ProviderService } from '../services';
import { ProviderCreateDto } from '../dto';
import { ProviderUpdateDto } from '../dto/update-provider.dto';

@Controller('provider')
@UseGuards(TenantGuard)
export class ProviderController {

  constructor(
    private readonly providerService: ProviderService
  ){}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllProviders(@Query() query: QueryCommonDto, @Req() req: Request) {
    const statusCode = HttpStatus.OK;
    const {limit ,skip} = query;
    const tenantId = req.tenantId;
    const [total, providers] = await Promise.all([
      this.providerService.countProvider({
        where:{
          tenantId
        }
      }),
      this.providerService.findAllProviders({
        skip,
        take: limit,
        where:{
          tenantId
        }
      })
    ])
    const allProviders = providers.map(provider => ({
      ...provider,
      createdAt: provider.createdAt.toLocaleString(),
      updatedAt: provider.updatedAt.toLocaleString(),
    }))

    return {
      statusCode,
      message: "All providers",
      data:{
        total,
        allProviders
      }

    }

  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProvider(@Body() body: ProviderCreateDto, @Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const tenantId = req.tenantId;
    const provider = await this.providerService.createProvider(body,tenantId);
    return {
      statusCode,
      message : "Provider created",
      data:{
        provider
      }
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async findIdProvider(@Param('id',ParseUUIDPipe)id: string){
    const statusCode  = HttpStatus.ACCEPTED
    const providerId = await this.providerService.findIdProvider(id,{
      select:{
        id: true,
        email: true,
        name: true,
        phone: true,
        status: true,
        buys: {
          select:{
            id: true,
            total: true,
            user:{
              select:{
                id: true,
                name: true
              }
            },
            time: true
          }
        },
        createdAt: true,
        updatedAt: true,
      }
    });
    const provider  = {
      ...providerId,
      createdAt: providerId.createdAt.toLocaleString(),
      updatedAt: providerId.updatedAt.toLocaleString(),
    }
    return{
      statusCode,
      message: `provider ${id} acepted`,
      data:{
        provider
      }
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateProvider(@Body() body:ProviderUpdateDto, @Param('id',ParseUUIDPipe)id: string){
    const statusCode = HttpStatus.ACCEPTED
    const provider = await this.providerService.updateProvider(body,id);

    return {
      statusCode,
      message: `id ${id} provider update`,
      data:{
        provider
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteProvider( @Param('id',ParseUUIDPipe)id: string){
    const statusCode = HttpStatus.ACCEPTED
    const provider = await this.providerService.deleteProvider(id);

    return {
      statusCode,
      message: `id ${id} provider updated`,
      data:{
        provider
      }
    }
  }

}
