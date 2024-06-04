import { IsInt, IsNumber, IsString, IsUUID } from "class-validator";


export class CreateInvitationDto{

  @IsNumber()
  @IsInt()
  rolId: number;

  @IsString()
  @IsUUID()
  userId: string;

}