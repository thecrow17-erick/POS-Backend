import { IsArray, IsDecimal, IsNumber, IsNumberString, IsObject, IsString, MinLength } from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from "nestjs-form-data";

export class ProductCreateDto{
  @IsString()
  @MinLength(3)
  name:                 string;

  @IsString()
  @MinLength(6)
  description:          string;

  @IsDecimal()
  @IsNumberString()
  price:                string;

  @IsString()
  categories:           string

  @IsString()
  @IsNumberString()
  discount:            string;
  
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/*'])
  photo:              MemoryStoredFile ;

}