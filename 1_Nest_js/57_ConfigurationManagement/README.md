# ⚙️ NestJS: Advanced Configuration Management (#57)

Salam! **`57_ConfigurationManagement`** dərsinə xoş gəldin!

Bu dərsdə NestJS-də konfiqurasiyaları (Environment Variables) **peşəkar və mütəşəkkil şəkildə necə idarə etmək (Configuration Management)** lazım olduğunu öyrənəcəksən.

---

## ❓ 1. Mövzunun Əsas Mahiyyəti Nədir?

Real backend layihələrində server **müxtəlif mühitlərdə (Stages)** çalışır:
1. **Local (Kompüterimizdə):** `localhost`, Port `3000`, test verilənlər bazası.
2. **Staging / Development (Sınaq Serveri):** Komandanın test etdiyi server.
3. **Production (Canlı Müştəri Serveri):** Real istifadəçilərin olduğu, yüksək təhlükəsizlik tələb edən server.

Müəllim bu dərsdə sənə **2 vacib professional texnika** öyrədir:
- **Dinamik `.env` Yüklənməsi:** `STAGE` dəyişəninə görə `.env.local` və ya `.env.production` fayllarını avtomatik seçmək.
- **Custom Config Wrapper Pattern:** Hər yerdə `this.configService.get('PORT')` yazmaq əvəzinə, özümüzün tiplənmiş `AppConfigService` klassımızı yaradaraq kodumuzu daha təmiz saxlamaq!

---

## 🚀 2. Üç Əsas Peşəkar Texnika

### 1️⃣ Mühitlərə Görə Dinamik `.env` Faylı Seçimi (`Stage Enum`)

`config/config.module.ts` daxilində `STAGE` mühitinə əsasən müvafiq faylı yükləyirik:

```typescript
export enum Stage {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true, // 👈 2-ci Sehrli Ayar!
      envFilePath: process.env.STAGE === Stage.LOCAL 
        ? ['.env.local'] 
        : ['.env.production', '.env'],
    }),
  ],
})
export class AppConfigModule {}
```

---

### 2️⃣ `expandVariables: true` (Dəyişən Genişləndirməsi)

`.env` faylı daxilində bir dəyişənin qiymətini digər dəyişənlərdən istifadə edərək düzəltmək üçün `expandVariables: true` yazılır:

```text
HOST=localhost
PORT=3000
# 💡 APP_URL avtomatik http://localhost:3000 olur!
APP_URL=http://${HOST}:${PORT}
```

---

### 3️⃣ Custom Config Wrapper Pattern (`AppConfigService`)

Sıradan proqramçılar hər yerdə belə yazır:
```typescript
// ❌ Səhv/Təhlükəli: String daxilində hərf səhvi ola bilər və tipi bilinmir (any)
const port = this.configService.get<number>('PORT');
```

Peşəkar proqramçılar isə **`AppConfigService`** sarğısı (wrapper) yazır:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get stage(): string {
    return this.configService.get<string>('STAGE', 'local');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get swaggerUsername(): string {
    return this.configService.get<string>('SWAGGER_USERNAME', 'admin');
  }
}
```

Və Servis daxilində nöqtə ilə mükəmməl avto-tamamlama (intelliSense) ilə istifadə edirlər:
```typescript
// ✅ Təmiz, Təhlükəsiz və Tiplənmiş (Strongly-typed):
const port = this.config.port;
const swaggerUser = this.config.swaggerUsername;
```

---

## 🎯 3. Qızıl Xülasə

1. **`isGlobal: true`** ──► ConfigModule-u bütün modullarda təkrar import etmədən əlçatan edir.
2. **`expandVariables: true`** ──► `.env` daxilində `${HOST}:${PORT}` kimi dəyişənləri bir-birinə bağlayır.
3. **`envFilePath` Ternary (`STAGE === Stage.LOCAL ? ...`)** ──► Local və Production `.env` fayllarını avtomatik seçir.
4. **`AppConfigService` Wrapper** ──► Tipləri qoruyur və hərf səhvi etməyə imkan vermir!

---

## 📂 Qovluqdakı Nümunə Fayllar:
- 📄 **[.env.local](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/.env.local)**
- 📄 **[.env.production](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/.env.production)**
- 📄 **[config/stage.enum.ts](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/config/stage.enum.ts)**
- 📄 **[config/config.module.ts](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/config/config.module.ts)**
- 📄 **[config/config.service.ts](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/config/config.service.ts)**
- 📄 **[app.service.ts](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/57_ConfigurationManagement/app.service.ts)**
