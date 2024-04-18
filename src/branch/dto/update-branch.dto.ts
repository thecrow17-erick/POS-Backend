import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';
import { IsBoolean } from 'class-validator';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @IsBoolean()
  status?:      boolean;

}
