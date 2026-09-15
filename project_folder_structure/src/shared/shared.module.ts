import { Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service.js';

@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Başqa modulların LoggerService-dən istifadə etməsi üçün export edirik
})
export class SharedModule {}
