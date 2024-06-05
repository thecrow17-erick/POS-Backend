import { IsInt, IsNumber, IsString, IsUUID } from "class-validator";


export class AsignInvitationDto{

  @IsNumber()
  @IsInt()
  rolId: number;

}