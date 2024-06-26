import { IsDecimal, IsInt, IsNumber, IsString } from "class-validator";


export class InsertProductDto{

  @IsNumber()
  @IsInt()
  productId:    number;

  @IsNumber()
  @IsInt()
  cant:         number;

  @IsString()
  @IsDecimal()
  price:        string;
}