import { IsArray, IsInt, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateInvitationDto{

  @IsNumber()
  @IsInt()
  rolId: number;

  @IsArray()
  @IsString({each: true})
  @IsUUID('4',{each: true})
  users: string[];

}