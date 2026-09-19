# 🔑 NestJS: Environment Variables & ConfigModule (#51)

Salam! **`51_env_variables`** dərsinə xoş gəldin!

Əgər videoda müəllimin göstərdiyi kodlardan və *"Kafka nə alaqə?"* sualından başın qarışıbsa, hiç narahat olma! Bu sənəddə **`.env` nədir**, **niyə koda şifrələri yazmırıq**, **`@nestjs/config` necə işləyir** və müəllimin nə üçün Kafka faylı göstərdiyini sıfırdan öyrənəcəksən.

---

## ❓ 1. "Kafka Nə Alaqə?" (Videoda Nə Baş Verirdi?)

### 💡 Həqiqət:
Müəllim videoda Kafka sistemi qurmurdu! Müəllim özünün real microservice proyektində `.env` fayllarını **necə mütəşəkkil şəkildə qruplaşdırdığını** (Best Practice) göstərirdi:

- `src/config/database.ts` ──► Bazanın şifrəsi və hostunu oxuyur.
- `src/config/app.ts` ──► Port nömrəsini oxuyur.
- `src/config/kafka.ts` ──► Kafka bağlantı adresini oxuyur (`process.env.KAFKA_BROKER`).

Yəni Kafka burada sadəcə bir **nümunə konfiqurasiya faylıdır**. Kafka dərsi keçilmir!

---

## 🔒 2. `.env` (Environment Variables) Nədir və Niyə Vacibdir?

### ⚠️ Problem (Hardcoded Credentials Risk):
Əgər sən verilənlər bazasının şifrəsini və ya JWT Secret key-ini doğrudan koda yazsan:
```typescript
const dbPassword = "my_secret_password_123";
```
1. Bu kodu GitHub-a yükləsən, şifrələrin **hər kəsə açıq görünəcək** və hakerlər bazanı dağıdacaq.
2. Local kompyuterində `localhost`, Production serverində isə fərqli IP istifadə edildiyi üçün koddakı rəqəmləri hər dəfə əllə dəyişməli olacaqsan.

### ✅ Həll (`.env` faylı):
Bütün məxfi məlumatlar layihənin kökündə duran **`.env`** faylına yazılır:
```text
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
JWT_SECRET=super_secret_jwt_key_99
```
Bu `.env` faylı `.gitignore`-a əlavə edilir ki, **GitHub-a getməsin**!

---

## 🛠️ 3. NestJS `@nestjs/config` Quraşdırılması və İstifadəsi

```bash
npm install @nestjs/config
```

### Step 1: `AppModule`-də Qlobal Aktivləşdirmək (`app.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,      // 🌐 Bütün modullarda təkrar import etmədən əlçatan edir
      envFilePath: '.env', // Və ya '.development.env' (1.png-dəki kimi)
    }),
  ],
})
export class AppModule {}
```

---

### Step 2: Service Daxilində `.env` Dəyərlərini Oxumaq (`ConfigService`)

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(private readonly configService: ConfigService) {}

  getAppConfig() {
    // 📍 .env daxilindəki dəyərləri oxuyur:
    const port = this.configService.get<number>('PORT');
    const dbHost = this.configService.get<string>('DATABASE_HOST');

    return { port, dbHost };
  }
}
```

---

## 🌟 4. Professional Yanaşma: Modulyar Config Faylları (`src/config/`)

Videodakı 2.png, 3.png, 4.png və 5.png şəkillərində müəllim tək `.env` oxumaq əvəzinə onları sahələrə böldü:

### A) Konfiqurasiya Faylının Yaradılması (`src/config/database.config.ts` - Image 3):
```typescript
export default () => ({
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
```

### B) Modulda `load` İlə Yüklənməsi (`app.module.ts` - Image 4):
```typescript
import dbConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig], // 👈 4.png-dəki mütəşəkkil konfiqurasiya yüklənməsi
    }),
  ],
})
export class AppModule {}
```

### C) Service Daxilində Oxunması (`users.service.ts` - Image 5):
```typescript
// 👈 5.png-dəki kimi nöqtə ilə təmiz oxunuş:
const dbHost = this.configService.get('database.host');
```

---

## 🎯 5. Qızıl Xülasə

1. **GitHub-a heç vaxt şifrə göndərmə!** Məxfi verilənləri `.env` faylında saxla.
2. **`.env` faylını `.gitignore`-a əlavə et.**
3. **`ConfigModule.forRoot({ isGlobal: true })`** yazaraq bütün proyektə yay.
4. **`this.configService.get('PORT')`** vasitəsilə təhlükəsiz şəkildə istifadə et.
