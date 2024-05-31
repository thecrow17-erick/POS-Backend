import { ArrayMinSize, IsArray, IsInt, IsString, MinLength } from "class-validator";


export class CreateRolDto{

  @IsString()
  @MinLength(2)
  desc: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({each: true})
  permissions: Array<number>;

}