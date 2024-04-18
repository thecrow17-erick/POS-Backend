import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { BodyControlDto } from './dto';
import { Response } from 'express';
import { ControlService } from './control.service';

@Controller('control')
export class ControlController {

  constructor(
    private readonly controlService: ControlService,
  ){}

  @Post("open")
  async open(@Body() bodyControlDto: BodyControlDto, @Res() res: Response) {
    const statusCode = HttpStatus.CREATED;
    const atmControl = await this.controlService.open(bodyControlDto);

    return res.status(statusCode).json({
      statusCode,
      message: "Logged atm",
      data: {
        atmControl
      }
    })
  }

  @Post("close")
  async close(@Body() bodyControlDto: BodyControlDto, @Res() res: Response) {
    const statusCode = HttpStatus.CREATED;
    const atmControl = await this.controlService.close(bodyControlDto);

    return res.status(statusCode).json({
      statusCode,
      message: "Logout atm",
      data: {
        atmControl
      }
    })
  }

}
