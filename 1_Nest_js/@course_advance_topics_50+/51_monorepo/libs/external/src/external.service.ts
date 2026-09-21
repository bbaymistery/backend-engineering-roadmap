import { Injectable } from '@nestjs/common';

@Injectable()
export class ExternalService {
  getHello(): string {
    return 'Hi, From Shared External Library!';
  }

  getSharedConfig() {
    return {
      appName: 'Monorepo System',
      apiVersion: 'v1.0',
    };
  }
}
