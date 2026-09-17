# 🔄 NestJS: Validation & Transformation Explained (#33)

Salam! **`33_validation_explained`** dərsinə xoş gəldin!

Bu sənəddə NestJS-də xaricdən (istifadəçidən) gələn datanın necə doğrulandığını (**Validation**) və tiplərinin necə çevrildiyini (**Transformation**), `class-validator` və `class-transformer` alətlərini və iç-içə (nested) DTO validasiyasını sıfırdan öyrənəcəksən.

---

## ❓ 1. Validation & Transformation Nədir və Niyə Vacibdir?

### 💡 Sadə Dildə İzah:
Front-end-dən və ya API istifadəçisindən məlumat gələndə (məsələn, Qeydiyyat forması), backend bu məlumatlara kor-koranə inanmamalıdır:
- Email həqiqətən email formatındadırmı? (`@IsEmail()`)
- Şifrə ən az 8 simvoldurmu? (`@MinLength(8)`)
- Yaş sahəsi mənfi ədəd və ya mətn göndərilibmi? (`@IsInt()`, `@Min(18)`)

**Validation (Doğrulama):** Gələn datanın qaydalara uyğunluğunu yoxlayır. Səhv olduqda avtomatik `400 Bad Request` qaytarır.
**Transformation (Çevrilmə):** Gələn datanı düzgün TypeScript tiplərinə çevirir (Məsələn, URL-də string kimi gələn `"25"` dəyərini `number` tipində `25`-ə çevirir).

---

## 🛠️ 2. İstifadə Olunan Əsas Kitabxanalar

```bash
npm install class-validator class-transformer
```

| Kitabxana | Məqsədi | Yanaşma |
| :--- | :--- | :--- |
| **`class-validator`** | DTO-lar daxilində dekoratorlarla validasiya qaydaları təyin edir. | `@IsString()`, `@IsEmail()` |
| **`class-transformer`** | Plain JavaScript obyektini DTO klasının real instansiyasına çevirir. | `@Type()`, `@Transform()` |
| **`zod` / `joi`** | Şema əsaslı (Schema-based) alternatvlərdir. | `z.object({...})` |

---

## 🏗️ 3. Sorğu Axını (Request Flow)

Sorğu Controller-ə çatmazdan əvvəl **ValidationPipe** onu qarşılayır:

```text
Gələn Sorğu (Request) ──► [ ValidationPipe ] ──► [ Controller ] ──► [ Service ]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     1. Validate (Yoxlayır)         2. Transform (Tiplərə çevirir)
```

---

## ⚡ 4. Global ValidationPipe Konfiqurasiyası (`main.ts`)

Bütün tətbiqdə avtomatik validasiyanın aktiv olması üçün `main.ts`-də quraşdırırıq:

```typescript
// 📄 main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // 🛡️ DTO-da tərifi olmayan artıq/yad sahələri avtomatik silir
      forbidNonWhitelisted: true, // ⚠️ Artıq sahə gələndə xəta qaytarır (400 Bad Request)
      transform: true,            // 🔄 Gələn datanı DTO klas instansiyasına və tiplərinə çevirir
    })
  );

  await app.listen(3000);
}
bootstrap();
```

---

## 📚 5. Ən Çox İstifadə Olunan Validator Dekoratorları

### 📝 String Validator-ları
- `@IsString()`: Dəyərin string olmasını tələb edir.
- `@IsNotEmpty()`: Sahənin boş (`""`, `null`, `undefined`) olmamasını tələb edir.
- `@Length(min, max)`: Simvol sayının aralığını təyin edir.
- `@MinLength(min)` / `@MaxLength(max)`: Minimum və ya maksimum simvol sayı.
- `@IsEmail()`: Düzgün email formatı (`user@example.com`).
- `@Matches(regex)`: Xüsusi Regex şablonuna uyğunluq (Məsələn, güclü şifrə şablonu).

### 🔢 Number Validator-ları
- `@IsNumber()` / `@IsInt()`: Ədəd və ya Tam ədəd olmasını yoxlayır.
- `@IsPositive()` / `@IsNegative()`: Müsbət və ya mənfi ədəd.
- `@Min(value)` / `@Max(value)`: Minimum və ya maksimum ədədi dəyər.

### 🔘 Boolean & Digər
- `@IsBoolean()`: `true` və ya `false` olmalıdır.
- `@IsOptional()`: Bu sahə məcburi deyil (göndərilməsə xəta vermir).
- `@IsEnum(MyEnum)`: Dəyərin təyin olunmuş Enum siyahısında olmasını tələb edir.

---

## 🧬 6. İç-içə (Nested) Obyektlərin və Massivlərin Validasiyası

Əgər DTO-nun daxilində başqa bir obyekt və ya obyektlər massivi (Array of Objects) varsa, **`@ValidateNested()`** və **`@Type()`** istifadə olunmalıdır!

```typescript
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Daxili DTO
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;
}

// 2. Əsas DTO
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // 📍 Tək daxili obyektin validasiyası:
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // 📍 Massiv daxilindəki obyektlərin validasiyası ({ each: true }):
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  previousAddresses?: AddressDto[];
}
```

---

## 🎯 7. Qızıl Xülasə

1. **ValidationPipe:** Dataya nəzarət edən filte/süzgəcdir.
2. **`whitelist: true`:** Xaricdən bədxassəli və ya lazımsız dataların sızmasının qarşısını alır (Mass-Assignment Vulnerability-dən qoruyur).
3. **`transform: true`:** String gələn id-ləri `number`-ə çevirir.
4. **Nested DTOs:** İç-içə obyektlərdə `@ValidateNested()` və `@Type(() => SubDto)` yazmaq **MƏCBURİDİR**, əks halda daxili obyekt yoxlanılmayacaq!
