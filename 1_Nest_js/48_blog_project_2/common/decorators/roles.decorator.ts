import { SetMetadata } from "@nestjs/common";

/**
 * ============================================================================
 * 👑 İCAZƏ VƏ ROLLAR: Role Enum & @Roles() Dekoratoru
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Rol Əsaslı İcazə Sistemində (Role-Based Access Control - RBAC) istifadə olunur.
 * Sistemdəki istifadəçi tiplərini (rollarını) təyin edir və Controller-də
 * hansı endpoint-ə hansı rolların daxil ola biləcəyini göstərir.
 * 
 * 💡 MƏSƏLƏN İSTİFADƏSİ:
 * Controller-də:
 * @Roles(Role.ADMIN)
 * @Delete('posts/:id')
 * deletePost() { ... }
 */

/**
 * Sistemdəki mövcud rolların siyahısı (Enum).
 * Səhvlərin qarşısını almaq üçün string ("admin", "user") əvəzinə bu Enum-dan istifadə olunur.
 */
export enum Role {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

// RolesGuard tərəfindən oxunacaq metadata açarı
export const ROLES_KEY = "roles";

/**
 * Metoda tələb olunan rolları yapışdıran dekorator.
 * Məsələn: `@Roles(Role.ADMIN, Role.MODERATOR)`
 * `SetMetadata` vasitəsilə `roles` açarı altında bu rolların massivini saxlayır.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

