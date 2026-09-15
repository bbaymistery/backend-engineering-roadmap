import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'NestJS Öyrənmə Layihəsinə Xoş Gəldiniz! 🚀';
  }
}
