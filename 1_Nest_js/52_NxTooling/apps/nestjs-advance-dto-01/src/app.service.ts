import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      service: 'nestjs-advance-dto-01',
      status: 'active',
      port: 4002,
    };
  }
}
