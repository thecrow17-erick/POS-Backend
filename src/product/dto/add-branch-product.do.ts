import { Type } from "class-transformer";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class AddBranchProductDto{
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  branchIds: number[];
}