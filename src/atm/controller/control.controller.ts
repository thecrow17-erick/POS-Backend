import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { BodyControlDto } from '../dto';
import { ControlService } from '../services';
import { AuthServiceGuard, RolesGuard, TenantGuard } from 'src/auth/guard';
import { Permission } from 'src/auth/decorators';

@Controller('control')
@UseGuards(TenantGuard,AuthServiceGuard,RolesGuard)
export class ControlController {

  constructor(
    private readonly controlService: ControlService,
  ){}

  @Post("open")
  @Permission("control caja")
  @HttpCode(HttpStatus.CREATED)
  async open(@Body() bodyControlDto: BodyControlDto) {
    const statusCode = HttpStatus.CREATED;
    const atmControl = await this.controlService.open(bodyControlDto);
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
  async close(@Body() bodyControlDto: BodyControlDto) {
    const statusCode = HttpStatus.CREATED;
    const atmControl = await this.controlService.close(bodyControlDto);

    return {
      statusCode,
      message: "Logout atm",
      data: {
        atmControl
      }
    }
  }

}
