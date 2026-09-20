import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    // 🔄 Dairəvi asılılığı (Circular Dependency) həll etmək üçün @Inject(forwardRef(...)) istifadə olunur!
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  validateUserToken(token: string): boolean {
    return token === 'valid_token_123';
  }

  getAuthDetails(userId: number) {
    const user = this.usersService.findUserById(userId);
    return {
      authenticated: true,
      user,
    };
  }
}
