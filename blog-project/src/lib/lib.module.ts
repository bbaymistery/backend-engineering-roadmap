import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Başqa modulların EmailService-dən istifadə etməsi üçün export edirik
})
export class LibModule {}
