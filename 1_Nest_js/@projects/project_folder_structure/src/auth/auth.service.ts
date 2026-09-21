import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Sadə giriş (Login) funksiyası
   */
  login(email: string): { accessToken: string; user: any } {
    const users = this.userService.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new UnauthorizedException('Daxil edilən e-poçt ünvanı tapılmadı!');
    }

    return {
      accessToken: `mock-jwt-token-for-user-${user.id}`,
      user,
    };
  }
}
