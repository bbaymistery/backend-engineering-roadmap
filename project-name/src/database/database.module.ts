import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // Başqa modulların bazaya müraciət edə bilməsi üçün export edirik
})
export class DatabaseModule {}
