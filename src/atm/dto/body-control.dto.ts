import { IsDecimal, IsIn, IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class BodyControlDto{
  @IsDecimal()
  monto:          string;


  @IsNumber()
  @IsInt()
  atmId:          number; 
}