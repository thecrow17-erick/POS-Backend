import { Type } from "class-transformer";
import { InsertSaleProductDto } from "./insert-sale-product.dto";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsDecimal, IsEmail, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";
import { StatePay, $Enums } from '@prisma/client';

export class CreateBuyDto{

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // Valida cada elemento del arreglo
  @Type(() => InsertSaleProductDto)
  products:     InsertSaleProductDto[]

  @IsString()
  @IsDecimal()
  pay:          string;

  @IsString()
  @IsDecimal()
  change:       string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  nitClient?:     string;

  @IsString()
  @IsEmail()
  client:         string;

  @IsNumber()
  @IsInt()
  atmId:          number;

  @IsEnum(StatePay)
  type:        StatePay;

  @IsNumber()
  @IsInt()
  branchId:     number;
}