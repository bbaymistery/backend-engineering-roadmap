# 🛡️ 📝 🔒 NestJS Request Body & DTO Validation (#63)

Salam! **`63_Request_Body_Validation`** dərsinə xoş gəldin!

Backend tətbiqlərində təhlükəsizliyin və məlumat dürüstlüyünün **1 nömrəli qaydası:** **"Klientdən gələn heç bir məlumata kor-koranə inanma!"**

İstifadəçi formul doldurarkən yanlış yaş daxil edə, boş ad göndərə, formata uyğun olmayan email daxil edə və ya sistemə zərər verə biləcək əlavə arzuolunmaz sahələr (Mass Assignment Attack) göndərə bilər.

NestJS-də **Request Body-nin yoxlanılması (Validation)** `class-validator`, `class-transformer` paketləri və NestJS-in **`ValidationPipe`** mexanizmi ilə avtomatlaşdırılır.

---

## 📥 1. `@Body()` Dekoratoru Nədir?

HTTP `POST`, `PUT`, `PATCH` sorğuları ilə gələn JSON verilənlər gövdəsini (payload) oxumaq üçün `@Body()` dekoratorundan istifadə olunur:

```typescript
// 1️⃣ Bütün body-ni almaq:
@Post('users')
createUser(@Body() createUserDto: CreateUserDto) {
  return createUserDto;
}

// 2️⃣ Yalnız 1 xüsusi sahəni almaq:
@Post('quick-email')
checkEmail(@Body('email') email: string) {
  return { email };
}
```

---

## 🧱 2. DTO (Data Transfer Object) və `class-validator`

DTO — Klientdən göndəriləcək məlumatların strukturunu, tiplərini və doğrulama qaydalarını (validation rules) müəyyən edən klassdır.

### 🛠️ Quraşdırılmalı Paketlər:
```bash
npm install class-validator class-transformer
```

### 📋 DTO Nümunəsi:

```typescript
import {
  IsString,
  IsEmail,
  IsInt,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @IsString({ message: 'Ad mətni (string) olmalıdır' })
  @MinLength(2, { message: 'Ad minimum 2 simvol olmalıdır' })
  name: string;

  @IsEmail({}, { message: 'Düzgün email daxil edin' })
  email: string;

  @IsInt()
  @Min(18, { message: 'Minimum yaş 18 olmalıdır' })
  age: number;

  @IsEnum(UserRole, { message: 'Rol yalnız ADMIN və ya USER ola bilər' })
  role: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;
}
```

---

## ⚙️ 3. `ValidationPipe` Konfiqurasiyası və Parametrləri

`ValidationPipe` — NestJS-ə daxil olan bütün payload-ları avtomatik DTO qaydaları ilə müqayisə edən və keçməyənləri `400 Bad Request` xətası ilə geri qaytaran sistemdir.

### 🌐 3.1 Qlobal Qoşulma (`main.ts`):

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // 🟢 1. Whitelist: DTO-da bəyan olunmayan kənar sahələri JSON-dan təmizləyir
      whitelist: true,

      // 🔴 2. ForbidNonWhitelisted: DTO-da olmayan kənar sahə gəldikdə XƏTA çıxarır (400)
      forbidNonWhitelisted: true,

      // 🔄 3. Transform: Gələn JSON obyektini avtomatik DTO klassının instansiyasına çevirir
      transform: true,
    }),
  );

  await app.listen(3000);
}
```

---

## 🔑 4. Əsas Validation Parametrlərinin Mənası

### 1️⃣ `whitelist: true` (Təhlükəsizlik Filteri)
Məsələn, istifadəçi `POST /users` edərkən DTO-da olmayan `isAdmin: true` sahəsi göndərsə, `whitelist: true` həmin sahəni sssizcə silir və bazaya keçməsinə imkan vermir (**Mass Assignment müdafiəsi**).

### 2️⃣ `forbidNonWhitelisted: true` (Ciddi Yoxlanış)
Əgər istifadəçi DTO-da olmayan kənar sahə göndərərsə, sistemi səssizcə silmək əvəzinə dərhal `400 Bad Request` xətası verir: `"property extraField should not exist"`.

### 3️⃣ `transform: true` (Avtomatik Tip Çevrilməsi)
URL Query parametrlərindən və ya JSON-dan gələn `"18"` mətnini DTO-dakı `age: number` tipinə avtomatik olaraq `number 18` kimi çevirir.

---

## 📊 Xülasə Qaydaları (Cheat-Sheet)

| Qayda / Dekorator | Mənası |
| :--- | :--- |
| **`@IsString()` / `@IsInt()`** | Tip doğrulama (String, Integer). |
| **`@IsEmail()`** | Formatın düzgün email olduğunu yoxlayır. |
| **`@Min(18)` / `@Max(100)`** | Ədədi göstəricilər üçün alt/üst hədd. |
| **`@MinLength(6)`** | Simvol sayı məhdudiyyəti. |
| **`@IsOptional()`** | Sahənin daxil edilməsi məcburi deyil. |
| **`@IsEnum(UserRole)`** | Yalnız təyin olunmuş Enum dəyərlərinə icazə verir. |
| **`whitelist: true`** | DTO-da olmayan kənar sahələri təmizləyir. |
