import { IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class ProviderCreateDto{

  @IsString()
  @MinLength(3)
  name:           string;

  @IsString()
  @IsEmail()
  email:          string;
  
  @IsPhoneNumber('BO')
  @IsString()
  phone:          string;
}