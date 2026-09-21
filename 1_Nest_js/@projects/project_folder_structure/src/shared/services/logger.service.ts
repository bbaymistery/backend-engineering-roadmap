import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`[SHARED LOG] ℹ️  ${message}`);
  }

  error(message: string): void {
    console.error(`[SHARED ERROR] ❌ ${message}`);
  }
}
