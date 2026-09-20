# 🗺️ 🔀 ⚡ NestJS API Routing, Global Prefixes & Versioning (#69)

Salam! **`69_api_routing`** dərsinə xoş gəldin!

NestJS tətbiqlərində sorğuların (HTTP Requests) hansı Controller və hansı metoda yönləndiriləcəyi **Routing (Marşrutlaşdırma)** mexanizmi tərəfindən idarə olunur.

Bu sənəddə **Global Prefix (`/api`), API Versioning (`/v1`, `/v2`), Wildcard marşrutlar (`ab*cd`), Sub-domain routinq və `RouterModule`** mövzularını dərindən öyrənirik.

---

## 🌐 1. Global Prefix (`app.setGlobalPrefix`)

Tətbiqdəki BÜTÜN Controller endpoint-lərinin önünə avtomatik sabit prefiks (məsələn: `/api`) əlavə etmək üçün `main.ts`-də `setGlobalPrefix` istifadə olunur.

### ⚙️ Konfiqurasiya (`main.ts`):
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔴 Bütün URL-lərin önünə /api əlavə edir (Məs: GET /api/users)
  app.setGlobalPrefix('api', {
    exclude: ['health', 'docs'], // İstisna olan (prefiksiz) marşrutlar
  });

  await app.listen(3000);
}
```

---

## 🔢 2. API Versiyalaşdırılması (API Versioning)

İstehsalatda olan API-lərdə breaking change (qırıcı dəyişiklik) etdikdə köhnə klientlərin (Mobil tətbiqlər) işini pozmamaq üçün **Versiyalaşdırma** tətbiq olunur.

### 🛠️ 2.1 Versiyalaşdırmanı Aktiv Etmək (`main.ts`):

NestJS 4 fərqli versiyalaşdırma növünü dəstəkləyir:

```typescript
import { VersioningType } from '@nestjs/common';

app.enableVersioning({
  type: VersioningType.URI, // 1️⃣ URI Versioning: /v1/users, /v2/users
  // type: VersioningType.HEADER, header: 'X-API-Version', // 2️⃣ Header ilə
  // type: VersioningType.MEDIA_TYPE, key: 'v=', // 3️⃣ Accept: application/json;v=2
  defaultVersion: '1',
});
```

---

### 🛠️ 2.2 Controller və Metod Səviyyəsində `@Version()`:

```typescript
import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Controller('users')
export class UsersController {

  // 🔹 Version 1 (GET /api/v1/users)
  @Version('1')
  @Get()
  getUsersV1() {
    return { version: 'v1', data: ['Əli'] };
  }

  // 🔹 Version 2 (GET /api/v2/users) - YENİ versiya
  @Version('2')
  @Get()
  getUsersV2() {
    return { version: 'v2', data: [{ id: 1, name: 'Əli' }] };
  }

  // 🔹 Neutral (Bütün versiyalarda eynilə işləyir: /api/v1/users/ping, /api/v2/users/ping)
  @Version(VERSION_NEUTRAL)
  @Get('ping')
  ping() {
    return { status: 'OK' };
  }
}
```

---

## 🔀 3. Wildcard (Joker) və Sub-Domain Routinq

### 📍 3.1 Wildcard Marşrutlar (`*`):
Ulduz (`*`) işarəsi hər hansı simvollar zəncirini əvəz edə bilir:

```typescript
// GET /users/abcd, GET /users/ab123cd, GET /users/ab_xyz_cd marşrutları uyğun gəlir
@Get('ab*cd')
getWildcard() {
  return { message: 'Wildcard marşrut işlədi!' };
}
```

---

### 📍 3.2 Sub-Domain Routinq (`host`):
Bəzən xüsusi Controller-lərin yalnız müəyyən subdomendən (məs: `admin.company.com`) gələn sorğuları qəbul etməsini istəyirik:

```typescript
@Controller({ host: 'admin.company.com', path: 'dashboard' })
export class AdminDashboardController {
  @Get()
  getAdminStats() {
    return { role: 'ADMIN_ONLY' };
  }
}
```

---

## 🌳 4. İyerarxik Modul Routinqi (`RouterModule`)

Böyük layihələrdə modulları qovluq strukturu kimi iyerarxik URL yoluna salmaq üçün `@nestjs/core`-dan gələn `RouterModule` istifadə edilir:

```typescript
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UserFeatureModule,
    RouterModule.register([
      {
        path: 'admin-panel', // Nəticə URL: /api/v1/admin-panel/users
        module: UserFeatureModule,
      },
    ]),
  ],
})
export class AppModule {}
```

---

## 📊 Xülasə Cədvəli (Cheat-Sheet)

| Özəllik | Sintaksis | Mənası |
| :--- | :--- | :--- |
| **Global Prefix** | `app.setGlobalPrefix('api')` | Bütün endpoint-lərin önünə `/api` əlavə edir. |
| **URI Versioning** | `app.enableVersioning({ type: VersioningType.URI })` | `/v1/users` və `/v2/users` marşrutlaşdırması. |
| **Metod Versiyası**| `@Version('2')` | Metodun müəyyən versiyaya aid olduğunu bildirir. |
| **Neutral Version** | `@Version(VERSION_NEUTRAL)` | Bütün API versiyalarında dəyişməz qalan marşrutlar. |
| **Subdomain** | `@Controller({ host: 'admin.site.com' })` | Yalnız xüsusi domendən gələn sorğuları qəbul edir. |
