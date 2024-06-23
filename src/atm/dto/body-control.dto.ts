import { IsDecimal, IsInt, IsNumber } from "class-validator";

export class BodyControlDto{
  @IsDecimal()
  monto:          string;

  @IsNumber()
  @IsInt()
  atmId:          number; 
}