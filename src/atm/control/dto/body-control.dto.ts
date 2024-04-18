import { IsDecimal, IsIn, IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class BodyControlDto{
  @IsDecimal()
  monto:          string;

  @IsUUID()
  @IsString()
  employeeId:     string;

  @IsNumber()
  @IsInt()
  atmId:          number; 
}