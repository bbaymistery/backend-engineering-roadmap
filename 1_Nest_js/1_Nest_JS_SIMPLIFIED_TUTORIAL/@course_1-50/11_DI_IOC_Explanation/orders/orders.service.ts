import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class OrdersService {
  // 🟢 UsersModule-dan gələn UsersService konstruktora INJECT olunur
  constructor(private readonly usersService: UsersService) {}

  createOrder(userId: number, product: string) {
    const user = this.usersService.findOne(userId);
    if (!user) {
      throw new Error('İstifadəçi tapılmadı!');
    }
    return {
      orderId: Math.floor(Math.random() * 1000),
      product,
      user,
    };
  }
}
