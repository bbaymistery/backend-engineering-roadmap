import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
  constructor(
    // 🔄 UsersService AuthService-ə müraciət edir, AuthService də UsersService-ə!
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  findUserById(id: number) {
    return { id, name: 'Əli Həsənov', role: 'ADMIN' };
  }

  getUserProfileWithToken(id: number, token: string) {
    const isValid = this.authService.validateUserToken(token);
    if (!isValid) {
      throw new Error('Token etibarsızdır!');
    }
    return this.findUserById(id);
  }
}
