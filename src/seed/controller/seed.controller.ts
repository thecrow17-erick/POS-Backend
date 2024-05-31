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
      this.seedService.seedPermission(),
      this.seedService.seedSuscription(),
    ])
    return {
      message: messages,
      statusCode
    }
  }

}
