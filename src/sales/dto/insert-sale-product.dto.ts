import {IsInt, IsNumber, IsString } from "class-validator";


export class InsertSaleProductDto{

  @IsNumber()
  @IsInt()
  productId:    number;

  @IsNumber()
  @IsInt()
  cant:         number;

}