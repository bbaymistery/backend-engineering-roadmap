import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExternalService } from '@app/external';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly externalService: ExternalService,
  ) {}

  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('shared-data')
  getSharedData() {
    return this.externalService.getSharedConfig();
  }
}
