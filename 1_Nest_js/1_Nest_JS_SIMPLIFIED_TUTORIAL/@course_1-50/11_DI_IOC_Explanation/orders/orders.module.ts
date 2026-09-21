import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule], // 🟢 UsersService-dən istifadə etmək üçün UsersModule IMPORT edilir
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
