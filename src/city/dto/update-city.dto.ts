import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';
import { IsBoolean } from 'class-validator';

export class UpdateCityDto extends PartialType(CreateCityDto) {

  @IsBoolean()
  status?:      boolean;


}
