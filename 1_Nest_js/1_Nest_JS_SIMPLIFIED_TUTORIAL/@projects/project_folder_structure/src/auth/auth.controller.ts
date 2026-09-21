import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth') // Endpoint: http://localhost:3000/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // POST http://localhost:3000/auth/login Body: { "email": "ali@example.com" }
  login(@Body('email') email: string) {
    return this.authService.login(email);
  }
}
