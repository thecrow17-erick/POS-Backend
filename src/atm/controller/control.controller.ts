import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { BodyControlDto } from '../dto';
import { Response } from 'express';
import { ControlService } from '../services';

@Controller('control')
export class ControlController {

  constructor(
    private readonly controlService: ControlService,
  ){}

  @Post("open")
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
