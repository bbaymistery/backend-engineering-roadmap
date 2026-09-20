import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get stage(): string {
    return this.configService.get<string>('STAGE', 'local');
  }

  get isProduction(): boolean {
    return this.stage === 'production';
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get appUrl(): string {
    return this.configService.get<string>('APP_URL', 'http://localhost:3000');
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get swaggerUsername(): string {
    return this.configService.get<string>('SWAGGER_USERNAME', 'admin');
  }

  get swaggerPassword(): string {
    return this.configService.get<string>('SWAGGER_PASSWORD', 'secret');
  }
}
