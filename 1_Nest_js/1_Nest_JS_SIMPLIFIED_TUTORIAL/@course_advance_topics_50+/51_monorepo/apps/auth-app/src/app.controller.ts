import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExternalService } from '@app/external';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly externalService: ExternalService,
  ) {}

  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Get('lib-info')
  getLibInfo(): string {
    return this.externalService.getHello();
  }
}
