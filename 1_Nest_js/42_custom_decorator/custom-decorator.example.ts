import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  Injectable,
  CanActivate,
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// ==========================================
// 1. CUSTOM PARAM DECORATOR (@User & @ClientIp)
// ==========================================

// Sorğudakı `req.user` obyekti çıxarır
export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user || { id: 1, name: 'Əli', role: 'admin' }; // Mock user

  return data ? user?.[data] : user;
});

// Sorğudakı IP ünvanını çıxarır
export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.ip || '127.0.0.1';
});

// ==========================================
// 2. CUSTOM METADATA DECORATOR (@Roles)
// ==========================================

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// ==========================================
// 3. GUARD (Reflector ilə Metadata-nın Oxunması)
// ==========================================

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user || { role: 'admin' };

    return requiredRoles.includes(user.role);
  }
}

// ==========================================
// 4. CONTROLLER-DƏ İSTİFADƏSİ
// ==========================================

@Controller('example')
export class ExampleController {
  // 📍 Custom Param Decorators istifadəsi
  @Get('profile')
  getProfile(@User() user: any, @User('name') userName: string, @ClientIp() ip: string) {
    return {
      fullUser: user,
      userNameOnly: userName,
      clientIp: ip,
    };
  }

  // 📍 Custom Metadata Decorator + Guard istifadəsi
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin')
  getAdminData(@User('name') name: string) {
    return {
      message: `Xoş gəldiniz Admin ${name}! 🛡️`,
    };
  }
}
