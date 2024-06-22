import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../service';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateUserDto } from '../dto/create-user.dto';

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

  @Get()
  testApi(){
    return "hello world";
  }

} 
