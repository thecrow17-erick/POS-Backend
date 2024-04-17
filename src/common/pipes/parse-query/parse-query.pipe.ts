import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryCommonDto } from 'src/common/dto/query-common.dto';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(QueryCommonDto, value);
    const errors = await validate(object);
    if (errors.length) {
      throw new BadRequestException('Validation failed');
    }
    return object;
  }
}
