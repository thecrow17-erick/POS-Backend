import { PartialType } from '@nestjs/mapped-types';
import { CreateAzureConnectionDto } from './create-azure-connection.dto';

export class UpdateAzureConnectionDto extends PartialType(CreateAzureConnectionDto) {}
