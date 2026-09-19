import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'nestjs-advance-auth-app-02',
      status: 'active',
      port: 4001,
    };
  }
}
