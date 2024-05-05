import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class createUserDto{
  
  @IsPhoneNumber("BO")
  @IsString()
  phone:          string;       

  @IsEmail()
  @IsString()
  email:          string;

  @IsString()
  @MinLength(4)
  name:           string;

  @IsString()
  @MinLength(4)
  password:       string;

  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/*'])
  photo?:         MemoryStoredFile;
}