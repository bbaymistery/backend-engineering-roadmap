import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  // 🟢 OrdersService bura INJECT olunur
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: { userId: number; product: string }) {
    return this.ordersService.createOrder(body.userId, body.product);
  }
}
