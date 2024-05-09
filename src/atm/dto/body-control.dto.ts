import { IsDecimal, IsIn, IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class BodyControlDto{
  @IsDecimal()
  monto:          string;

  @IsString()
  employeeCode:     string;

  @IsNumber()
  @IsInt()
  atmId:          number; 
}