# 📜 ⚡ 🏢 NestJS Logging Master Guide (#58, #59, #60)

Salam! **`58_59_60_Logging`** dərslərinə xoş gəldin!

Videoları tək-tək izləməyə heç gərək yoxdur! Bu sənəd NestJS-də Loqlama (Logging) mövzusunu **bütün 3 mərhələni (Built-in Logger, Pino və Winston)** sıfırdan və peşəkar səviyyədə tam əhatə edir.

---

## ❓ 1. Loqlama (Logging) Nədir və Niyə Vacibdir?

Real backend tətbiqləri serverdə işləyərkən:
- Əgər serverdə xəta baş versə (`500 Internal Server Error`),
- Verilənlər bazasına qoşulma qopsa,
- Və ya xakerlər icazəsiz sorğu göndərsə,

Biz terminalda və ya fayllarda nələrin baş verdiyini görməliyik. **Loqlama — serverin hər anının fotoşəkilini çəkən gündəliyidir!**

---

## 📜 TOPIC 58: NestJS Built-in Logger, Log Səviyyələri & Custom Logger

NestJS öz daxilində hazır **`Logger`** sinfi ilə gəlir (`import { Logger } from '@nestjs/common'`).

### 📊 1. NestJS-də 6 Log Səviyyəsi (Log Levels):

| Səviyyə | Metod | Mənası / Nə Vaxt İstifadə Olunur? |
| :--- | :--- | :--- |
| **`fatal`** | `logger.fatal()` | 🔴 Serverin tam çökməsinə səbəb olan kritik fəlakət. |
| **`error`** | `logger.error()` | ❌ Xətalar (Database qoşulmadı, 500 xətası, Exception-lar). |
| **`warn`** | `logger.warn()` | 🟡 Xəbərdarlıqlar (Köhnəlmiş API istifadəsi, RAM yüksəkliyi). |
| **`log`** | `logger.log()` | 🟢 Ümumi informasiya (Server 3000 portunda işə düşdü). |
| **`debug`** | `logger.debug()` | 🔵 Proqramçının xətanı axtarması üçün detallı məlumat. |
| **`verbose`** | `logger.verbose()` | 🟣 Ən xırda detallara qədər (Every step log). |

---

### ⚙️ 2. `main.ts`-də Loq Səviyyələrini Məhdudlaşdırmaq:

Production serverində terminalın kerəksiz dərəcədə dolmaması üçün yalnız **`error`** və **`warn`** loqlarını göstərmək olar:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // 💡 Yalnız xətaları və xəbərdarlıqları ekrana çıxarır!
    logger: ['error', 'warn'], 
  });
  await app.listen(3000);
}
```

---

### 🛠️ 3. Özel (Custom) Logger Yaradılması (`LoggerService`):

Əgər NestJS-in öz standart loq görünüşünü bəyənməsən, `LoggerService` interfeysini impliment edərək öz xüsusi loggerini yaza bilərsən:

```typescript
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyCustomLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(`[MY_APP] 🟢 ${context}: ${message}`);
  }
  error(message: string, trace?: string, context?: string) {
    console.error(`[MY_APP] 🔴 ${context}: ${message}`);
  }
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}
```

`main.ts`-də qoşulması:
```typescript
const app = await NestFactory.create(AppModule, {
  logger: new MyCustomLogger(), // 👈 Öz custom loggerimiz!
});
```

---

## ⚡ TOPIC 59: Pino Logger (`nestjs-pino`) — Yüksək Performanslı JSON Logging

### 💡 Pino Nədir və Niyə Microservice-lərdə Seçilir?
**Pino** — Node.js dünyasının **ən SÜRƏTLİ və ZER0-OVERHEAD (yaddaşı doldurmayan)** loqlama kitabxanasıdır.

### 🔥 Niyə Cloud Sistemlər (Datadog, ElasticSearch/ELK, Kibana) Pino-nu Sevir?
Pino loqları bəzəkli mətn kimi yox, **Pure JSON** kimi çıxarır:

```json
{"level":30,"time":1726842000000,"pid":1234,"hostname":"server-1","req":{"method":"GET","url":"/users"},"msg":"Request completed"}
```

Cloud sistemləri (Datadog/Elastic) JSON loqlarını saniyədə milyonlarla oxuyub filtrləyə bilir.

### 🛠️ Pino Quraşdırılması (`pino-logger.config.ts`):
```bash
npm install nestjs-pino pino-http pino-pretty
```

`main.ts` və ya `app.module.ts`:
```typescript
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' 
          ? { target: 'pino-pretty' } // Dev-də rəngli görünüş
          : undefined, // Prod-da pure JSON
      },
    }),
  ],
})
export class AppModule {}
```

---

## 🏢 TOPIC 60: Winston Logger (`nest-winston`) — Production-Ready File Logging

### 💡 Winston Nədir?
**Winston** — loqları eyni anda müxtəlif yerlərə (**Transports**) yazmaq üçün backend-in ən güclü alətidir.

### 📦 Transports Anlayışı (Loqların Gedəcəyi Yerlər):
1. **Console Transport:** Terminala yazır.
2. **File Transport:** Diskdəki `logs/error.log` faylına yazır.
3. **Daily Rotate File Transport:** Hər gün üçün ayrı fayl açır (`application-2026-09-20.log`).

### 🛠️ Winston Günlük Fayl Rotasiyası (`winston-logger.config.ts`):
```bash
npm install nest-winston winston winston-daily-rotate-file
```

```typescript
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  transports: [
    // 1️⃣ Konsola rəngli çıxış:
    new winston.transports.Console(),

    // 2️⃣ Xətaları yalnız error.log faylına yaz:
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

    // 3️⃣ Hər gün üçün avtomatik yeni fayl yaradılması:
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Köhnə loqları .zip edir
      maxSize: '20m',      // 20MB olanda yeni fayl açır
      maxFiles: '14d',     // 14 gündən köhnə loqları avtomatik silir!
    }),
  ],
};
```

---

## 📊 3 Logger-in Yan-Yana Müqayisə Cədvəli

| Özəllik | NestJS Built-in Logger | Pino Logger (`nestjs-pino`) | Winston Logger (`nest-winston`) |
| :--- | :--- | :--- | :--- |
| **Sürət / Performans** | ⚖️ Orta | 🚀 **Dəhşət Sürətli (Ən yuxarı)** | ⚖️ Orta |
| **Çıxış Formatı** | 🎨 NestJS Mətni | 🤖 Pure JSON | 📝 Mətn, JSON, Custom |
| **Fayla Yazmaq (File Logging)**| ❌ Yoxdur (Əllə yazılmalıdır)| ⚠️ Plugin ilə | ✅ **Mükəmməl (Daily Rotate)** |
| **Ən Yaxşı İstifadə Yeri** | Kicik/Orta NestJS App | Microservice-lər & Cloud (Kubernetes) | Böyük Enterprise & Monolit Tətbiqlər |

---

## 🎯 Hansını Nə Zaman, Harada və Niyə Seçməliyik?

### 1️⃣ NestJS Built-in Logger (Standart Logger)
* **Nə zaman / Harada:** Kiçik və orta ölçülü monolit layihələrdə, MVP-lərdə və əlavə `npm` paketi yükləmək istəmədikdə.
* **Niyə:** Sıfır konfiqurasiya tələb edir, NestJS ilə hazır gəlir, terminalda rəngli və oxunaqlı çıxış verir.

### 2️⃣ Pino Logger (`nestjs-pino`)
* **Nə zaman / Harada:** Microservices (Mikroxidmət) arxitekturasında, High-Load (yüksək yüklü) sistemlərdə və Cloud mühitlərində (Datadog, ElasticSearch/ELK, Grafana Loki, AWS CloudWatch).
* **Niyə:** Node.js-in ən sürətli loggeridir (Zero-Overhead). Pure JSON çıxardığı üçün Cloud sistemləri loqları saniyələr içində oxuyub analiz edə bilir.

### 3️⃣ Winston Logger (`nest-winston`)
* **Nə zaman / Harada:** Loqların fiziki serverin diskində (`.log` fayllarında) saxlanması məcburi olan Enterprise, Bank, Maliyyə və Səhiyyə layihələrində.
* **Niyə:** Mükəmməl `DailyRotateFile` dəstəyi var. Loqları günlük ayırır, diski doldurmamaq üçün avtomatik `.zip` edir və müəyyən gündən köhnələri avtomatik silir.

