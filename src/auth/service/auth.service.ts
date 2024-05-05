import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt  from 'bcrypt';

import { UsersService } from 'src/users/service';
import { LoginUser } from '../dto';
import { PayloadToken } from '../interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService : ConfigService,
  ){}

  async loginSaaS(body: LoginUser){
    try {
      const user = await this.userService.findUser({
        where: {
          email: body.email,
        },
      })
      
      if(!user)
        throw new BadRequestException("user not found")

      const passwordValidate =  bcrypt.compareSync(body.password, user.password);

      if(!passwordValidate)
        throw new BadRequestException("password not validate")

      const payload: PayloadToken = {
        userId: user.id
      }

      const token = this.signJWT({
        expires: "6h",
        payload,
      })

      return {
        user,
        token
      }

    } catch (error) {
      if(error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException(`server error ${JSON.stringify(error)}`)
    }
  }

  signJWT({
    payload,
    expires,
  }: {
    payload: jwt.JwtPayload;
    expires: number | string;
  }): string {
    return this.jwtService.sign(payload, 
      {
        secret: this.configService.get<string>("secret_key_jwt"), 
        expiresIn: expires 
      });
  }
}
