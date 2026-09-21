import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [UsersModule, OrdersModule],
})
export class AppModule { }
