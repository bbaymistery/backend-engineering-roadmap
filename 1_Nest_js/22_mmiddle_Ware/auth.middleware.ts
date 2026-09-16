// 📄 src/core/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Express Request interfeysini genişləndiririk ki, req.user istifadə edə bilək
export interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log('🌐 [Middleware] HTTP Request tutuldu...');

    const authHeader = req.headers.authorization;

    // Əgər Authorization Header yoxdursa, davam etmirik
    if (!authHeader) {
      throw new UnauthorizedException('Authorization Header tapılmadı!');
    }

    // Nümunə: "Bearer admin-secret-token"
    const token = authHeader.split(' ')[1];

    // Simulyasiya: Token-dən istifadəçi məlumatını oxuyub req.user-ə yapışdırırıq
    if (token === 'admin-secret-token') {
      req.user = {
        id: 'usr-100',
        username: 'ali_admin',
        roles: ['admin', 'user'],
      };
    } else {
      req.user = {
        id: 'usr-200',
        username: 'valis_user',
        roles: ['user'], // Admin deyil!
      };
    }

    console.log(`✅ [Middleware] İstifadəçi tapıldı: ${req.user.username} (Roles: ${req.user.roles.join(', ')})`);

    // Növbəti addıma (Guard-a) keçid veririk!
    next();
  }
}
