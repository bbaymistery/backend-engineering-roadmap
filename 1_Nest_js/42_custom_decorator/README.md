# 🎨 NestJS: Custom Decorators Explained (#42)

Salam! **`42_custom_decorator`** dərsinə xoş gəldin!

Əgər NestJS-də `@Get()`, `@Body()`, `@UseGuards()` kimi `@` simvolu ilə başlayan ifadələrin arxasında nə dayandığını və **öz xüsusi Bəzədicimizi (Custom Decorator)** necə yaradacağımızı öyrənmək istəyirsənsə, doğru yerdəsən! 

Bu sənəddə bir tələbə kimi **Custom Decorator nədir**, **niyə istifadə edirik**, **Guards və Middleware ilə əlaqəsi nədir** sorularına ən sadə dildə cavab tapacaqsan.

---

## ❓ 1. Decorator (Bəzədici) Nədir? (Ən Sadə İzah)

### 💡 Həyati Analogiya:
Təsəvvür et ki, bir bağlamanın (kods sətirinin) üzərinə **"MƏXFİ"** və ya **"VİP"** stikeri (etiket) yapışdırırsan.
TypeScript və NestJS-də `@` simvolu ilə başlayan hər bir söz bir **Decorator-dur (Stikerdir)**.

* `@Controller('users')` ──► Bu klasın Controller olduğunu bildirir.
* `@Get()` ──► Bu metodun HTTP GET sorğusu olduğunu bildirir.
* `@Body()` ──► Sorğunun Body hissəsini çıxarır.

---

## 🚀 2. Niyə Öz Xüsusi (Custom) Decorator-umuzu Yaradırıq?

### ⚠️ Problem (Hər Dəfə Kodu Təkrar Etmək):
Təsəvvür et ki, istifadəçi login olub və onun məlumatları sorğuda (`req.user`) saxlanılır.
Hər dəfə Controller-də istifadəçini almaq üçün belə yazmalı olacaqsan:

```typescript
// ❌ Hər dəfə @Req() yazıb req.user-i əllə çıxarmaq narahatdır:
@Get('profile')
getProfile(@Req() req) {
  const user = req.user;
  return user;
}
```

### ✅ Həll (Custom `@User()` Decorator-u):
Özümüz sadə bir `@User()` bəzədicisi yaradırıq və kodumuzu **tertəmiz** edirik:

```typescript
// ✅ Çox səliqəli və oxunaqlı:
@Get('profile')
getProfile(@User() user: UserEntity) {
  return user;
}

// 🎯 Hətta istəsək yalnız istifadəçinin İD-sini ala bilərik:
@Get('id')
getUserId(@User('id') userId: number) {
  return userId;
}
```

---

## 🛠️ 3. NestJS-də Custom Decorator-ların 2 Əsas Növü

NestJS-də custom bəzədicilər 2 məqsədlə yaradılır:

---

### Növ A: Param Decorator (Parametr Çıxaran Bəzədici)
Sorğunun (`req`) daxilindən xüsusi məlumatları kəsib çıxarmaq üçün `createParamDecorator` funksiyasından istifadə olunur.

#### 1. Custom `@User()` Decorator-unun Yaradılması (`user.decorator.ts`):
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Əgər @User('email') yazılıbsa, sadəcə email-i qaytarır
    return data ? user?.[data] : user;
  },
);
```

#### 2. Custom `@IpAddress()` Decorator-u (Sorğunun IP-ni almaq üçün):
```typescript
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip;
  },
);
```

---

### Növ B: Metadata Decorator (Guards və Middleware üçün Etiket)
Notunda qeyd etdiyin kimi: *"we can use this decorator either in guards or middleware"*.
Yəni biz bir metoda etiket (Metadata) vururuq, daha sonra **Guard** və ya **Middleware** o etiketi oxuyub qərar verir.

#### 1. Custom `@Roles()` Decorator-unun Yaradılması (`roles.decorator.ts`):
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Metodun üzərinə tələb olunan rolları yapışdırır
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

#### 2. Guard Daxilində Həmin Etiketin Oxunması (`roles.guard.ts`):
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 🔍 @Roles() dekoratorunun yapışdırdığı etiketi Reflector ilə oxuyuruq:
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);
  }
}
```

---

## 💻 4. Controller-də Birgə İstifadəsi

```typescript
@Controller('users')
export class UsersController {
  
  // 📍 1. Custom Param Decorator
  @Get('profile')
  getProfile(@User() user: any, @IpAddress() ip: string) {
    return { user, clientIp: ip };
  }

  // 📍 2. Custom Metadata Decorator + Guard
  @Get('admin-panel')
  @UseGuards(RolesGuard)
  @Roles('admin', 'superadmin') // 👈 Guard bu etiketi oxuyub icazə verəcək
  getAdminPanel() {
    return { message: 'Məxfi Admin Paneli' };
  }
}
```

---

## 🎯 5. Qızıl Xülasə

1. **Custom Param Decorator (`createParamDecorator`):** `@Req()` yazmadan `req.user`, `req.ip` kimi dataları təmiz şəkildə Controller metoduna ötürmək üçündür.
2. **Custom Metadata Decorator (`SetMetadata`):** Metodların üzərinə etiket (Məsələn: `@Roles('admin')`) vurmaq üçündür.
3. **Guards & Middleware İlə Əlaqəsi:** `Reflector` vasitəsilə bəzədicinin vurduğu etiketi Guards və ya Middleware daxilində oxuyub icazə veririk.
