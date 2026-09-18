import { SetMetadata } from "@nestjs/common";

/**
 * ============================================================================
 * 🔓 DEKORATOR: @Public()
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Susmaya görə (default) bütün endpoint-lər təhlükəsizlik üçün giriş (JWT)
 * tələb edə bilər. Əgər hər hansı bir endpoint-in (məsələn: /auth/login, /auth/register)
 * hər kəsə açıq (Public) olmasını istəyiriksə, həmin metodun üzərinə `@Public()` yazırıq.
 * 
 * 💡 necə İŞLƏYİR?
 * NestJS-in `SetMetadata` funksiyasından istifadə edərək endpoint-ə "isPublic: true"
 * adlı gizli bir açar/metaməlumat (metadata) yapışdırır.
 * Daha sonra AuthGuard `Reflector` vasitəsilə bu açarı oxuyur və əgər `isPublic === true` olarsa,
 * JWT token tələb etmədən istifadəçini içəri buraxır.
 */

// Guard-lar tərəfindən yoxlanılacaq unikal metadata açarı
export const IS_PUBLIC_KEY = "isPublic";

// Metoda @Public() qoyulduqda metadata-ya `isPublic: true` yazılır
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

