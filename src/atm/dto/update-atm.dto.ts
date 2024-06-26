import { PartialType } from '@nestjs/mapped-types';
import { CreateAtmDto } from './create-atm.dto';
import { IsBoolean } from 'class-validator';

export class UpdateAtmDto extends PartialType(CreateAtmDto) {}
