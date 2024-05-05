import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service';
import { LoginUser } from '../dto';

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
}
