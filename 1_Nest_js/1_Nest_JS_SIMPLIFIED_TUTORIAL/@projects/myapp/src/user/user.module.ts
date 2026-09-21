import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule], // DatabaseService-dən istifadə etmək üçün DatabaseModule daxil edilir
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
