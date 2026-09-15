import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard.js';
import { LoggingInterceptor } from './interceptors/logging.interceptor.js';

@Module({
  providers: [AuthGuard, LoggingInterceptor],
  exports: [AuthGuard, LoggingInterceptor],
})
export class CoreModule {}
