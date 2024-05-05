import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUser{
  @IsEmail()
  @IsString()
  email:        string;

  @IsString()
  @MinLength(3)
  password:     string;

}