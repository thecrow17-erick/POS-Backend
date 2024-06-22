import { IsInt, IsNumber, IsString, IsUrl, MinLength } from "class-validator";

export class SuscriptionCreateDto {
  @IsNumber()
  @IsInt()
  suscriptionId:  number;

  @IsString()
  @IsUrl()
  hosting:        string

  @IsString()
  @MinLength(5)
  name:        string
}