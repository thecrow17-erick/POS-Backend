import { IsInt, IsNumber, IsString, MinLength } from "class-validator";

export class CreateAtmDto {

  @IsString()
  @MinLength(2)
  name:           string;

  @IsNumber()
  @IsInt()
  branchId:       number;
}
