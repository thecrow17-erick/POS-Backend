import { IsString, MinLength } from "class-validator";

export class CreateCityDto {

  @IsString()
  @MinLength(4)
  name:       string;
}
