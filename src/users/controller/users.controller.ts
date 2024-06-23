import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../service';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthSaasGuard } from 'src/auth/guard';
import { Request } from 'express';
import { QueryCommonDto } from 'src/common';
@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService,
  ){}


  @Post()
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  async createUsers(@Body() body: CreateUserDto){
    const statusCode = HttpStatus.CREATED;
    const user = await this.userService.createUser(body);
    return {
      statusCode,
      data: {
        user
      },
      message: "User create"
    }
  }

  @Get("invitation")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthSaasGuard)
  async finAllUserInvitation(@Query() query: QueryCommonDto, @Req() req: Request){
    const statusCode = HttpStatus.OK;
    const {limit,skip} = query;
    const userId = req.UserId;
    const allInvitations = await this.userService.findAllInvitation({
      where:{
        userId
      },
      skip,
      take: limit,
      select: {
        id: true,
        rol: true,
        tenant: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    const invitations = allInvitations.map((inv)=> ({
      ...inv,
      createdAt: inv.createdAt.toLocaleString(),
      updatedAt: inv.updatedAt.toLocaleString()
    }))
    const total = await this.userService.countAllInvitation({
      where:{
        userId
      }
    });
    return {
      statusCode,
      message: "all invitation",
      data: {
        total,
        invitations
      }
    }
  }

  @Get()
  testApi(){
    return "hello world";
  }

} 
