import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt  from 'bcrypt';

import { UsersService } from 'src/users/service';
import { LoginUser, updateMemberDto } from '../dto';
import { PayloadToken, PayloadTokenTenant } from '../interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService : ConfigService,
    private readonly prisma : PrismaService,    
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
        expires: 10 * 24 * 60 * 60,
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


  async loginService(body: LoginUser, tenantId: number){
    try {
      const user = await this.userService.findUser({
        where: {
          email: body.email,
        },
      })
      
      if(!user)
        throw new BadRequestException("user not found")

      const findUserTenant = await this.prisma.memberTenant.findFirst({
        where:{
          tenantId,
          userId: user.id
        },
        select:{
          id: true,
          userId: true,
          passwordTenant: true,
          rol: {
            select:{
              id: true,
              desc: true,
              status: true,
              permissions:{
                select:{
                  permission:{
                    select:{
                      desc: true,
                      id: true,
                      module: true,
                    }
                  }
                }
              }
            }
          }
        }
      })  
      if(!findUserTenant)
        throw new BadRequestException("user in tenant not found")

      const passwordValidate =  bcrypt.compareSync(body.password, findUserTenant.passwordTenant);

      if(!passwordValidate)
        throw new BadRequestException("password not validate")
      
      const payload: PayloadTokenTenant = {
        userId: user.id,
      }

      const token = this.signJWT({
        expires: 10 * 24 * 60 * 60,
        payload,
      })

      return {
        user,
        token,
        memberRole: findUserTenant
      }

    } catch (error) {
      if(error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException(`server error ${JSON.stringify(error)}`)
    }
  }

  async updatePassword(body: updateMemberDto,userId: string,tenantId:number){
    try {
      const saltOrRounds = bcrypt.genSaltSync(10)
      console.log(userId)
      const userFind = await this.prisma.memberTenant.findFirst({
        where:{
          userId,
          tenantId
        }
      })
      if(!userFind)
        throw new NotFoundException("el id no se encuentra en ningun usuario")
      const passwordValid = bcrypt.compareSync(body.password,userFind.passwordTenant);
      if(!passwordValid)
        throw new UnauthorizedException("El password no es correcto, intente de nuevo")

      const passwordUpdate = await this.prisma.memberTenant.update({
        where:{
          id: userFind.id,
          tenantId
        },
        data:{
          passwordTenant: bcrypt.hashSync(body.password_update,saltOrRounds)
        }
      })    

      return passwordUpdate;
    } catch (err) {
      if(err instanceof NotFoundException)
        throw err;
      if(err instanceof UnauthorizedException)
        throw err;

      throw new InternalServerErrorException(`server error ${JSON.stringify(err)}`)
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
