# 🛡️ NestJS Middleware & Auth Guards Explained | Core Components (#22)

Salam! NestJS öyrənməyə davam edən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`22_mmiddle_Ware`** qovluğundakı mövzunu — NestJS-in ən vacib iki təməl qoruyucu komponenti olan **Middleware** və **Auth Guards**-ın nə olduğunu, onların arasındakı fərqi və birlikdə necə möhtəşəm bir komanda kimi çalışdıqlarını **heç bir şəkil olmadan**, sırf aydın sxemlər, professional qovluq strukturu və TypeScript kodları ilə sıfırdan öyrənəcəksən.

---

## ❓ 1. Middleware və Guard Fərqi Nədir? (Ən Vacib Sual)

Çox zaman yeni başlayanlar Middleware ilə Guard-ı bir-biri ilə qarışdırırlar. Gəl fərqi sadə analogiya ilə anlayaq:

### 💡 Real Həyat Analogiyası (Gecə Klubu / VİP Konsert):
* **Middleware (Qəbul Masası / Bilet Yoxlayan):** Qapıda durub gələn qonağın kimliyini yoxlayır, cibindəki biletini oxuyur və boynuna kart asır (`req.user = { name: 'Ali', role: 'admin' }`). Sonra onu içəri zala ötürür (`next()`).
* **Guard (VİP Qapısındakı Mühafizəçi):** Sırf VİP otağının qapısında durur. Boynundakı karta baxır: *"Sənin rolun Admin-dir? Bəli -> Keç içəri (`return true`). Xeyr -> Giriş Qadağandır (`return false / 403 Forbidden`)."*

---

## 🔄 2. Sxematik İcra Axını (Şəkil 1 və 2-nin İzahı)

Sorğu gələndə Middleware və Guard aşağıdakı addımlarla işləyir:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. HTTP Request Received (Sorğu Serverə Daxil Olur)                    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Apply Middleware (auth.middleware.ts)                                │
│    - Authorization Header-i tutulur ("Bearer token...")                │
│    - Token parçalanır və istifadəçi tapılır                             │
│    - Məlumat Sorğuya yapışdırılır: req.user = { roles: ['admin'] }     │
│    - next() çağırılaraq növbəti addıma ötürülür                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Check Guard Conditions (auth.guard.ts)                               │
│    - context.switchToHttp().getRequest() ilə req.user oxunur           │
│    - user.roles.includes('admin') yoxlanılır                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
   ┌────────────────────────────────┐   ┌────────────────────────────────┐
   │ [Conditions Met: TRUE]         │   │ [Conditions Not Met: FALSE]    │
   │ ✅ Allow Access                │   │ ⛔ Deny Access                 │
   │ Controller Handler İcra Olunur │   │ 403 Forbidden Error Qayıdır    │
   └────────────────────────────────┘   └────────────────────────────────┘
```

---

## 📁 3. Professional Layihə Qovluq Strukturu (Şəkil 3-ün İzahı)

Şəkil 3-də gördüyümüz kimi, böyük layihələrdə Middleware, Guard, Pipe və Interceptor-lar kök `src/core/` qovluğunda səliqəli şəkildə qruplaşdırılır:

```text
src/
├── core/                        # 🏛️ Təməl (Core) Komponentlər
│   ├── guards/                  # Təhlükəsizlik Guard-ları
│   │   └── auth.guard.ts        # Rolu yoxlayan Guard
│   ├── interceptors/            # Nəzarətçi Interceptor-lar
│   ├── interfaces/              # Custom Interfeyslər
│   ├── middleware/              # Sorğunu qarşılayan Middleware-lər
│   │   └── auth.middleware.ts   # Token-i oxuyan Middleware
│   └── pipes/                   # Validation Pipe-ları
│
├── domain/                      # 💼 Biznes Modulları
│   └── task/
│       ├── task.controller.ts   # @UseGuards(AuthGuard) tətbiq olunan yer
│       └── task.module.ts
│
└── app.module.ts                # Middleware-in qeydiyyata alındığı modul
```

---

## 💻 4. Canlı Kodlar və Addım-Addım İzahı

---

### 1️⃣ `auth.middleware.ts` — Token-i oxuyub `req.user`-ə yapışdıran Middleware

Middleware sorğunu qarşılayır, başlığındakı `Authorization: Bearer ...` tokenini oxuyur və tapdığı istifadəçi məlumatını sorğunun (`req.user`) üzərinə yazır:

```typescript
// 📄 auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

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
    if (!authHeader) {
      throw new UnauthorizedException('Authorization Header tapılmadı!');
    }

    const token = authHeader.split(' ')[1];

    // Token-ə uyğun istifadəçini req.user-ə yapışdırırıq
    if (token === 'admin-secret-token') {
      req.user = { id: 'usr-100', username: 'ali_admin', roles: ['admin'] };
    } else {
      req.user = { id: 'usr-200', username: 'valis_user', roles: ['user'] };
    }

    console.log(`✅ [Middleware] User təyin olundu: ${req.user.username}`);
    next(); // 👈 Guard-a keçid verdik!
  }
}
```

---

### 2️⃣ `auth.guard.ts` — Rolu Yoxlayan Guard (Şəkil 5-dəki Kod!)

Guard Middleware-in hazırladığı `req.user.roles` siyahısına baxır. Əgər daxilində `'admin'` varsa `true`, yoxdursa `false / ForbiddenException` atır:

```typescript
// 📄 auth.guard.ts (Şəkil 5-dəki kodun tam versiyası)
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CustomRequest } from './auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('🛡️ [Guard] Rol Yoxlanışı Başladı...');

    // ExecutionContext vasitəsilə Request-i oxuyuruq
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const roles = user.roles;
    console.log("Assigned roles: " + roles.join(","));

    // Yoxlayırıq ki, istifadəçinin 'admin' rolu var ya yox:
    if (roles.includes('admin')) {
      return true; // ✅ İcazə verildi!
    }

    // ⛔ İcazə verilmədi!
    throw new ForbiddenException('Bu resursa daxil olmaq üçün Admin rolu lazımdır!');
  }
}
```

---

### 3️⃣ `task.controller.ts` — `@UseGuards(AuthGuard)` Tətbiqi (Şəkil 4-dəki Kod!)

Controller-də müəyyən bir route-u qorumaq üçün `@UseGuards(AuthGuard)` decorator-undan istifadə edirik:

```typescript
// 📄 task.controller.ts (Şəkil 4-dəki kodun tam versiyası)
import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('/api/v1/tasks')
export class TaskController {

  // 📍 Bu endpoint Guard tərəfindən qorunur (Sırf Admin-lər girə bilər)
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard) // 👈 Təhlükəsizlik Guard-ı bura bərkidilib!
  async findAll() {
    return [
      { id: 1, title: 'Server İnfrastrukturunu Qurnız', status: 'IN_PROGRESS' },
    ];
  }
}
```

---

## 🎯 5. Yekun Xülasə (Qızıl Qaydalar)

1. **Middleware:** Sorğunu qarşılayır, data parçalayır (parsing), token oxuyur və `req.user`-ə yapışdırır. `next()` ilə davam edir.
2. **Guard:** Məqsədi sırf İCAZƏ VERMƏK və ya QADAĞAN ETMƏKDİR (`canActivate` -> `true/false`).
3. **Mükəmməl Birlik:** Middleware məlumatı hazırlayır (`req.user`), Guard isə həmin məlumatı yoxlayır (`roles.includes('admin')`).
