import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private readonly config: AppConfigService) {}

  getHello(): string {
    // 💡 Güclü tiplənmiş (Strongly-typed) konfiqurasiya istifadəsi:
    return `Hello World! Current Stage: ${this.config.stage}, Port: ${this.config.port}, App URL: ${this.config.appUrl}, Swagger User: ${this.config.swaggerUsername}`;
  }
}
