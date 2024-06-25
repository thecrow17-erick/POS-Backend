import { Type } from "class-transformer";
import { IsInt, IsNumber, IsNumberString } from "class-validator";
import { QueryCommonDto } from "src/common";

export class productsQueryDto extends QueryCommonDto{

  @IsNumberString()
  branchId:      String;
}
