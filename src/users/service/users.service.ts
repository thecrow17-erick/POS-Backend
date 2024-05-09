import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt  from 'bcrypt';


import { PrismaService } from 'src/prisma';
import { createUserDto } from '../dto';
import { IOptionUser } from '../interface';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma : PrismaService,
  ){}
  
  async createUser(body: createUserDto){
    const saltOrRounds = bcrypt.genSaltSync(10)
    try {
      const findUser = await this.findUser({
        where: {
          OR: [
            {
              email: body.email,
            },
            {
              name: body.name,
            },
            {
              phone: body.phone,
            }
          ]
        }
      }) 

      
      if(findUser) 
        throw new BadRequestException("user bad request")
      const [userCreate] = await this.prisma.$transaction([
        this.prisma.user.create({
          data: {
            email: body.email,
            phone: body.phone,
            name:  body.name,
            password: bcrypt.hashSync(body.password,saltOrRounds)
          }
        })
      ])
      return userCreate;
    } catch (error) {
      if(error instanceof BadRequestException) 
        throw error;

      throw new InternalServerErrorException(`server Error ${JSON.stringify(error)}`)
    }
  }

  async findUser({
    where,
    select,
    orderBy
  }: IOptionUser){
    try {
      const FindUser = await this.prisma.user.findFirst({
        where,
        select,
        orderBy
      })
      return FindUser;
    } catch (err) {
      throw new InternalServerErrorException(`server Error ${JSON.stringify(err)}`)
    }
  }

  async findIdUser(id: string){
    try {
      const FindUser = await this.prisma.user.findUnique({
        where:{
          id
        }
      })
      return FindUser;
    } catch (err) {
      throw new InternalServerErrorException(`server Error ${JSON.stringify(err)}`)
    }
  }
}
