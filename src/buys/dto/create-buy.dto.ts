import { Type } from "class-transformer";
import { InsertProductDto } from "./insert-product.dto";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsIn, IsInt, IsNumber, IsString, IsUUID, ValidateNested } from "class-validator";

export class CreateBuyDto{

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // Valida cada elemento del arreglo
  @Type(() => InsertProductDto)
  products:     InsertProductDto[]

  @IsString()
  @IsUUID()
  providerId:   string;

  @IsNumber()
  @IsInt()
  branchId:     number;
}