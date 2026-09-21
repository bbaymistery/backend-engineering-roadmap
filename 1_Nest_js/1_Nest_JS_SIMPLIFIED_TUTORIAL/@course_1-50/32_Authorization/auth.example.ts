import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// ==========================================
// 1. ROLES DECORATOR & GUARD (RBAC)
// ==========================================

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Rol tələbi yoxdursa, keçidə icazə ver
    }

    const { user } = context.switchToHttp().getRequest();
    // user.role tələb olunan rollardan biridirmi?
    return user && requiredRoles.includes(user.role);
  }
}

// ==========================================
// 2. MOCK JWT GUARD
// ==========================================

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Simulyasiya: Gələn sorğuya şərti istifadəçi obyekti qoşuruq
    req.user = {
      id: 1,
      email: 'user@example.com',
      role: 'admin', // Test üçün 'admin' və ya 'user' dəyişdirilə bilər
    };
    return true;
  }
}

// ==========================================
// 3. AUTH CONTROLLER
// ==========================================

@Controller('auth')
export class AuthController {
  // Public Route - Giriş hamıya açıqdır
  @Post('login')
  async login() {
    return {
      access_token: 'mock.jwt.token.here',
    };
  }

  // Qorunan Route - Yalnız daxil olmuş istifadəçilər
  @UseGuards(MockJwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'İstifadəçi Profili',
      user: req.user,
    };
  }

  // Qorunan + Səlahiyyətli Route - Yalnız Adminlər üçün!
  @UseGuards(MockJwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdminData() {
    return {
      message: 'Məxfi Admin Paneli Məlumatları 🛡️',
    };
  }
}
