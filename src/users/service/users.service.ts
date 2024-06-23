import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt  from 'bcrypt';


import { PrismaService } from 'src/prisma';
import { CreateUserDto } from '../dto';
import { IOptionInvitation, IOptionUser } from '../interface';
import { MailsService } from 'src/mails/mails.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma : PrismaService,
    private readonly mailsService: MailsService,
  ){}
  
  async createUser(body: CreateUserDto){
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
        throw new BadRequestException("El usuario ya se encuentra en sistema")
      const response = await this.prisma.$transaction(async(tx)=>{

        const userCreate = await tx.user.create({
          data: {
            email: body.email,
            phone: body.phone,
            name:  body.name,
            password: bcrypt.hashSync(body.password,saltOrRounds)
          }
        });
        await this.mailsService.sendUserConfirmation(userCreate.name,userCreate.email);
        return userCreate;
      })
      return response;
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
  async countUsers({
    where,
  }: IOptionUser){
    try {
      const FindUser = await this.prisma.user.count({
        where,
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

  async findAllUser({
    where,
    select,
    orderBy,
    skip,
    take
  }: IOptionUser){
    try {
      const FindUser = await this.prisma.user.findMany({
        where,
        select,
        orderBy,
        skip,
        take
      })
      return FindUser;
    } catch (err) {
      throw new InternalServerErrorException(`server Error ${JSON.stringify(err)}`)
    }
  }  

  async findAllInvitation({
    where,
    select,
    skip,
    take,    
  }:IOptionInvitation){
    try {
      const allInvitation = await this.prisma.invitationTenant.findMany({
        where,
        select,
        skip,
        take
      })
      return allInvitation;
    } catch (err) {
      throw new InternalServerErrorException(`server Error ${JSON.stringify(err)}`)
    }
  }

  async countAllInvitation({
    where,
  }:IOptionInvitation){
    try {
      const allInvitation = await this.prisma.invitationTenant.count({
        where,
      })
      return allInvitation;
    } catch (err) {
      throw new InternalServerErrorException(`server Error ${JSON.stringify(err)}`)
    }
  }
}
