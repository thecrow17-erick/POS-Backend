import { IsDecimal, IsInt, IsNumber, IsNumberString, IsString, MinLength } from "class-validator";

export class CreateBranchDto {

  @IsString()
  @MinLength(3)
  address:        string;  

  @IsString()
  name:           string;
  
  @IsDecimal()
  lng:            string;

  @IsDecimal()
  lat:            string;

  @IsNumber()
  @IsInt()
  cityId:         number; 
}
