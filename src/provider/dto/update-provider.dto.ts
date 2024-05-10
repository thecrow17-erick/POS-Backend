import { PartialType } from "@nestjs/mapped-types";
import { ProviderCreateDto } from "./create-provider.dto";

export class ProviderUpdateDto extends PartialType(ProviderCreateDto) {}