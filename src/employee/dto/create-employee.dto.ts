import { IsEmail, IsNumberString, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class CreateEmployeeDto {
  @IsString()
  @IsEmail()
  email:        string;

  @IsString()
  @MinLength(6)
  name:         string;
  
  @IsString()
  @IsPhoneNumber('BO')
  phone:        string;

  @IsNumberString()
  @IsString()
  branchId:     string;

}
