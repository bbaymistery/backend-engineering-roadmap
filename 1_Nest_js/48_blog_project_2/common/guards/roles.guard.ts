import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role, ROLES_KEY } from "../decorators/roles.decorator";

/**
 * ============================================================================
 * 🛡️ ROLLAR GUARD-I: RolesGuard
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Guard (Keşikçi) — HTTP sorğusu Controller metoduna çatmazdan ƏVVƏL işə düşən
 * təhlükəsizlik baryeridir.
 * `RolesGuard` istifadəçinin rolunun bu endpoint-ə girməyə icazəsi olub-olmadığını yoxlayır.
 * 
 * 💡 NECƏ İŞLƏYİR?
 * 1. `@Roles(Role.ADMIN)` dekoratoru ilə qoyulmuş rolları `Reflector` vasitəsilə oxuyur.
 * 2. Əgər heç bir rol tələb olunmursa (`requiredRoles` yoxdursa), keçidə icazə verir (`true`).
 * 3. Əgər rol tələb olunursa, sorğudakı `req.user.role` dəyərinin bu rollara uyğun olub-olmadığını yoxlayır.
 * 4. Qaydalar ödənilərsə `true` (icazə ver), ödənilməzsə `false` (403 Forbidden) qaytarır.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector — NestJS-in metadata oxuyan daxili köməkçi servisi
  constructor(private reflector: Reflector) {}

  /**
   * Sorğunun davam etməsinə icazə verilib-verilmədiyini müəyyən edən metod.
   * @returns boolean (`true` = keçidə icazə var, `false` = giriş qadağandır/403)
   */
  canActivate(context: ExecutionContext): boolean {
    // 1. Controller metodundan və ya Controller sinfindən @Roles(...) dekoratoru ilə təyin olunmuş rolları oxuyuruq
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Əgər bu endpoint üçün heç bir rol məhdudiyyəti qoyulmayıbsa, hər kəs girə bilər
    if (!requiredRoles) {
      return true;
    }

    // 3. HTTP Request obyektindən istifadəçi (req.user) məlumatını alırıq (AuthGuard tərəfindən yazılmış)
    const { user } = context.switchToHttp().getRequest();

    // 4. Əgər daxil olmuş istifadəçi yoxdursa, keçid rədd edilir
    if (!user) {
      return false;
    }

    // 5. İstifadəçinin rolu (user.role) tələb olunan rollar siyahısında varmı? (some metodu ən azı 1 uyğunluq axtarır)
    return requiredRoles.some((role) => user.role === role);
  }
}

