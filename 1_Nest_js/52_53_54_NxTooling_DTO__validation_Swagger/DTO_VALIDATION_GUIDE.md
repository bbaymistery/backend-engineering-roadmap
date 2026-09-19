# 🛡️ NestJS DTO Validation Bələdçisi (`52_NxTooling_DTO__validation`)

Salam! Bu layihədə **Nx Monorepo** strukturu üzərində **DTO Validation (Məlumatların Təsdiqlənməsi & Təhlükəsizlik)** mexanizmi tam quraşdırıldı.

---

## ❓ 1. DTO Validation Nədir və Niyə Vacibdir?

### ⚠️ Problem:
Frontend-dən serverə POST/PUT sorğusu ilə JSON məlumatları gələndə (məsələn, qeydiyyat forması), istifadəçi bilərək və ya bilməyərək:
- Email əvəzinə `"email_deyil"` yaza bilər.
- Ad sahəsini boş buraxa bilər.
- Yaş sahəsinə mənfi rəqəm (`-25`) və ya hərflər yaza bilər.
- Xakerlər baza strukturunu dağıtmaq üçün DTO-da olmayan zərərli sahələr (`{ "isAdmin": true }`) göndərə bilər.

### ✅ Həll (DTO Validation + `ValidationPipe`):
Biz **`class-validator`** və **`class-transformer`** paketlərindən istifadə edərək DTO klassına xüsusi dekoratorlar qoyuruq və NestJS-in **`ValidationPipe`** mexanizmini aktivləşdiririk. Səhv məlumat gələn kimi NestJS avtomatik **`400 Bad Request`** xətası qaytarır!

---

## 📦 2. Ortak DTO Təyini (`packages/shared-dto/src/user.dto.ts`)

Ortak DTO kitabxanamızda **`CreateUserDto`** klassı belə təyin olunub:

```typescript
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  GUEST = 'Guest',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Ad boş ola bilməz!' })
  @MinLength(2, { message: 'Ad ən azı 2 simvoldan ibarət olmalıdır!' })
  name: string;

  @IsEmail({}, { message: 'Düzgün email ünvanı daxil edin!' })
  @IsNotEmpty({ message: 'Email məcburidir!' })
  email: string;

  @IsEnum(UserRole, { message: 'Rol yalnız Admin, User və ya Guest ola bilər!' })
  role: UserRole;

  @IsOptional()
  @IsInt({ message: 'Yaş tam ədəd olmalıdır!' })
  @Min(18, { message: 'Yaş ən azı 18 olmalıdır!' })
  @Max(100, { message: 'Yaş 100-dən böyük ola bilməz!' })
  age?: number;
}
```

---

## ⚙️ 3. NestJS Global `ValidationPipe` Quraşdırılması (`main.ts`)

`apps/nestjs-advance-dto-01/src/main.ts` faylında DTO doğrulamasını aktivləşdirdik:

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // 🧹 DTO-da təyin olunmayan yad sahələri silir
    forbidNonWhitelisted: true, // 🚫 DTO-da olmayan əlavə sahə gəlsə 400 Bad Request atır
    transform: true,            // 🔄 JSON-ı avtomatik TypeScript DTO klassına çevirir
  }),
);
```

### 💡 ValidationPipe Parametrlərinin Sirri:
1. **`whitelist: true`**: Əgər xaker `{ name: "Ali", email: "a@b.com", role: "User", hack: true }` göndərsə, `hack` sahəsini səssizcə təmizləyir.
2. **`forbidNonWhitelisted: true`**: Əgər DTO-da olmayan extra sahə göndərilsə, sorğunu bloklayır və `"property hack should not exist"` xətası atır!
3. **`transform: true`**: URL-dən string kimi gələn ID-ləri (məsələn `"123"`) avtomatik number-ə (`123`) çevirir.

---

## 🧪 4. Canlı Test Ssenariləri (Düzgün və Səhv Sorğular)

### ❌ SƏHV SORĞU (Validation Xətası Verəcək):
```bash
POST http://localhost:4002/dto-test/validate-user
Content-Type: application/json

{
  "name": "A",
  "email": "invalid-email",
  "role": "SuperAdmin",
  "age": 15
}
```
#### 🔴 Cavab (`400 Bad Request`):
```json
{
  "statusCode": 400,
  "message": [
    "Ad ən azı 2 simvoldan ibarət olmalıdır!",
    "Düzgün email ünvanı daxil edin!",
    "Rol yalnız Admin, User və ya Guest ola bilər!",
    "Yaş ən azı 18 olmalıdır!"
  ],
  "error": "Bad Request"
}
```

---

### ✅ DÜZGÜN SORĞU (Validation-dan Keçəcək):
```bash
POST http://localhost:4002/dto-test/validate-user
Content-Type: application/json

{
  "name": "Aytac",
  "email": "aytac@example.com",
  "role": "Admin",
  "age": 22
}
```
#### 🟢 Cavab (`201 Created`):
```json
{
  "success": true,
  "validatedData": {
    "name": "Aytac",
    "email": "aytac@example.com",
    "role": "Admin",
    "age": 22
  },
  "source": "nestjs-advance-dto-01"
}
```
