import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SeedService } from '../service';

@Controller('seed')
export class SeedController {
  constructor(
    private readonly seedService : SeedService
  ) {}


  @Post("create")
  @HttpCode(HttpStatus.CREATED)
  async seedAll(){
    const statusCode = HttpStatus.CREATED;
    const messages = await Promise.all([
      this.seedService.seedRol(),
      this.seedService.seedModule(),
      this.seedService.seedSuscription(),
      this.seedService.seedPaymentMethod(),
    ])
    return {
      message: messages,
      statusCode
    }
  }

}
