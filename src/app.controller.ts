import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.checkServerHealth();
  }

  @Get('seed')
  async seedRolesAndUser() {
    return await this.appService.seedData();
  }
}
