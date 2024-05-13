import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service';
import { LoginUser } from '../dto';
import { Request } from 'express';
import { TenantGuard } from '../guard';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async loginSas(@Body() body : LoginUser){
    const statusCode = HttpStatus.OK;

    const data =await this.authService.loginSaaS(body);
    return {
      message: "Sign in ok",
      statusCode,
      data: {
        ...data
      }
    }
  }

  @Post("login/service")
  @HttpCode(HttpStatus.OK)
  @UseGuards(TenantGuard)
  async loginService(@Body() body : LoginUser,@Req() req : Request){
    const statusCode = HttpStatus.OK;
    const tenantId = req.tenantId;
    const data =await this.authService.loginService(body,tenantId);
    return {
      message: "Sign in ok",
      statusCode,
      data: {
        ...data
      }
    }
  }
}
