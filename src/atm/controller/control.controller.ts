import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { BodyControlDto } from '../dto';
import { ControlService } from '../services';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';
import { Request } from 'express';
import { AtmService } from '../services/atm.service';
import { BranchService } from 'src/branch/services';
import { ParseQueryPipe, QueryCommonDto } from 'src/common';

@Controller('control')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class ControlController {

  constructor(
    private readonly controlService: ControlService,
    private readonly atmService:AtmService,
    private readonly branchService: BranchService
  ){}

  @Get("atms")
  @Permission("control caja")
  @HttpCode(HttpStatus.OK)
  async findAtm(@Query('branchId', ParseIntPipe) branchId: number,@Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    return {
      statusCode,
      message: "find atms",
      data:{
        total: await this.atmService.countAll({
          where:{
            AND:[
              {
                tenantId,
              },
              {
                active: true
              },
              {
                branchId
              }
            ]
          }
        }),
        atms: await this.atmService.findAll({
          where:{
            AND:[
              {
                tenantId,
              },
              {
                active: true
              },
              {
                branchId
              }
            ]
          }
        })
      }
    }
  }

  @Get("  ")
  @Permission("control caja")
  @HttpCode(HttpStatus.OK)
  async findBranch(@Query(new ParseQueryPipe) query:QueryCommonDto,@Req() req: Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const {limit,search,skip } = query;
    return {
      statusCode,
      message: "find branch",
      data:{
        total: await this.branchService.countAll({
          where:{
            tenantId,
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }),
        branch: await this.branchService.findAll({
          where: {
            tenantId,
            name: {
              contains: search,
              mode: "insensitive"
            }
          },
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            status: true,
            city: true,
            address: true,
            createdAt: true,
            updatedAt: true
          }
        })
      }
    }
  }


  @Post("open")
  @Permission("control caja")
  @HttpCode(HttpStatus.CREATED)
  async open(@Body() bodyControlDto: BodyControlDto, @Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const userId = req.UserId;
    const atmControl = await this.controlService.open(bodyControlDto,userId);
    return {
      statusCode,
      message: "Logged atm",
      data: {
        atmControl
      }
    }
  }

  @Post("close")
  @Permission("control caja")
  @HttpCode(HttpStatus.CREATED)
  async close(@Body() bodyControlDto: BodyControlDto,@Req() req: Request) {
    const statusCode = HttpStatus.CREATED;
    const userId = req.UserId;
    const atmControl = await this.controlService.close(bodyControlDto,userId);

    return {
      statusCode,
      message: "Logout atm",
      data: {
        atmControl
      }
    }
  }

}
