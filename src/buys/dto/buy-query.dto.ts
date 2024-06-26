import { IsDate, IsOptional } from "class-validator";
import { QueryCommonDto } from "src/common";



export class QueryBuyDto extends QueryCommonDto{

  @IsDate()
  @IsOptional()
  startDate?:      Date;

  @IsDate()
  @IsOptional()
  endDate?:       Date;


}