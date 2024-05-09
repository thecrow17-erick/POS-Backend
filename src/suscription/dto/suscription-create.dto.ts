import { IsInt, IsNumber, IsString, IsUrl } from "class-validator";

export class SuscriptionCreateDto {
  @IsNumber()
  @IsInt()
  suscriptionId:  number;

  @IsString()
  @IsUrl()
  hosting:        string

}