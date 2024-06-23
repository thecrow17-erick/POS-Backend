import { IsEmail, IsString, MinLength } from "class-validator";

export class updateMemberDto{
  @IsString()
  @MinLength(3)
  password:        string;

  @IsString()
  @MinLength(3)
  password_update:     string;

}