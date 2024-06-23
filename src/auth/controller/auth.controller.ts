import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service';
import { LoginUser, updateMemberDto } from '../dto';
import { Request } from 'express';
import { AuthServiceGuard, TenantGuard } from '../guard';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async loginSas(@Body() body : LoginUser){
    const statusCode = HttpStatus.CREATED;

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

  @Patch("password-update/service")
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(AuthServiceGuard,TenantGuard)
  async updatePasswordService(@Body() body : updateMemberDto,@Req() req : Request){
    const statusCode = HttpStatus.ACCEPTED;
    const tenantId = req.tenantId;
    const userId = req.UserId;
    return {
      statusCode,
      message: "password actualizado",
      data: {
        member: await this.authService.updatePassword(body,userId,tenantId)
      }
    }
  }
}
