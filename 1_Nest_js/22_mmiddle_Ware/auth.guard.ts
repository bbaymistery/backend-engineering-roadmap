// 📄 src/core/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomRequest } from './auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    console.log('🛡️ [Guard] Təhlükəsizlik və Rol Yoxlanışı Başladı...');

    // ExecutionContext vasitəsilə HTTP Request obyektini alırıq
    const request = context.switchToHttp().getRequest<CustomRequest>();

    // Middleware tərəfindən req.user-ə yapışdırılmış istifadəçi obyektini oxuyuruq
    const user = request.user;

    if (!user) {
      console.log('❌ [Guard] İstifadəçi tapılmadı!');
      return false;
    }

    const roles = user.roles;
    console.log(`🔍 [Guard] Təyin olunmuş rollar: ${roles.join(', ')}`);

    // Yoxlayırıq ki, istifadəçinin rolları arasında 'admin' var ya yox:
    if (roles.includes('admin')) {
      console.log('✅ [Guard] İcazə Verildi! (Admin rolları mövcuddur)');
      return true; // Controller-in icrasına icazə verir!
    }

    console.log('⛔ [Guard] Giriş Qadağandır! (Admin rolunuz yoxdur)');
    throw new ForbiddenException('Bu resursa daxil olmaq üçün Admin rolu lazımdır!');
  }
}
