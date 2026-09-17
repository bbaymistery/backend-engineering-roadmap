# ⚡ NestJS Express & Fastify Adapters | HTTP Platform Abstraction (#29)

Salam! NestJS öyrənmə yolunda irəliləyən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`29_Expres_fastify_adapters`** mövzusunu — NestJS-in **Platform Abstraction (Platforma Abstrakasiyası)** gücünü, standart **Express.js** adapterindən ultran-sürətli **Fastify** adapterinə necə keçildiyini, xarici kitabxanaların **Injectable Provider (Wrapper)** formasına salınmasını və Modul konfiqurasiyasını **heç bir şəkil olmadan**, sırf aydın sxemlər və TypeScript kodları ilə sıfırdan öyrənəcəksən.

---

## 🏗️ 1. Integration Map (Layihə Inteqrasiya Xəritəsi - Şəkil 1)

NestJS-in təməl fəlsəfəsi müstəqillikdir. NestJS Core (Modullar, Provayderlər, Decorator-lar) aşağıdakı platforma adapterləri ilə müstəqil şəkildə çalışa bilir:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ NestJS Core (Modules, Providers, Decorators)                           │
│ Dependency Injection Container                                         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (HTTP Adapter Abstraction)
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│ Express       │          │ Fastify       │          │ Diğər Xüsusi  │
│ Adapter       │          │ Adapter       │          │ Adapterlər    │
│ (Default)     │          │ (High Speed)  │          │ (Microservices│
└───────────────┘          └───────────────┘          └───────────────┘
```

---

## ❓ 2. Platform Abstraction (Abstrakasiya) Nədir?

### 💡 Sadə Dildə Analogiya:
Təsəvvür et ki, evində bir **Universial Elektrik Rozetkası (NestJS)** var. Bu rozetkaya istər **Televizor (Express)**, istərsə də **Paltaryuyan (Fastify)** qoşasan, elektrik avtomatik işləyəcək.

NestJS-də də sən Controller-də `@Get()`, `@Post()`, `@Body()`, `@Param()` yazırsan. Altında **Express.js** işləyir, yoxsa **Fastify** işləyir — **sənin yazdığın bizness kodun heç bir dəyişiklik tələb etmir!**

---

## ⚡ 3. Express.js vs Fastify Adapter Müqayisəsi

| Xüsusiyyət | Express.js Adapter (Default) | Fastify Adapter |
| :--- | :--- | :--- |
| **Statusu** | NestJS-in susmaya görə (default) gələn adapteridir. | İstəyə görə keçid edilən ultran-sürətli adapterdir. |
| **Sürət / Performans** | Standart Node.js sürəti (Çox yaxşıdır). | Express-dən **2-3 dəfə daha sürətlidir** (High RPS). |
| **Ekosistem** | Ən böyük Node.js ekosisteminə və middleware-lərə sahibdir. | Xüsusi Fastify plugin-lərinə sahibdir. |
| **Nə vaxt istifadə olunur?** | 90% standart layihələrdə və Express middleware-ləri lazım olduqda. | Saniyədə on minlərlə sorğu (High Throughput) gələn böyük layihələrdə. |

---

## 💻 4. 4 Əsas Açar Konsept (Key Concepts) və Kod İzahı

---

### 1️⃣ Platform Adapters (Fastify-a Necə Keçilir?)

Fastify-a keçmək üçün əvvəlcə paketi yükləyirik:
```bash
npm i @nestjs/platform-fastify
```

Daha sonra `main.ts` faylımızda sadəcə 2 sətir dəyişiklik edirik:

```typescript
// 📄 main.ts (Fastify Adapter İlə)
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  // 📍 NestFactory-yə FastifyAdapter-i ötürürük:
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

---

### 2️⃣ Providers as Wrappers (Xarici Kitabxanaların İnjectable Olunması)

Xarici alətləri (Prisma, TypeORM, Redis Client) NestJS DI sisteminə daxil etmək üçün onları `@Injectable()` olan bir klasla bükürük (Wrap edirik):

```typescript
// 📄 prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // Modul başlayanda DB qoşulur
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Modul bağlandıqda DB əlaqəsi kəsilir
  }
}
```

---

### 3️⃣ Module Organization (Modul Təşkilatlanması)

NestJS-də hər bir xarici inteqrasiya (Database, Cache, Queue) öz müstəqil modulunu alır:

```typescript
// 📄 app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),           // 🗄️ Database Inteqrasiyası
    CacheModule.register(),                   // ⚡ Yaddaş Keşləməsi
    BullModule.forRoot({ redis: config }),    // 📬 Növbə (Queue) Sistemi
  ],
})
export class AppModule {}
```

---

### 4️⃣ Decorator-Based Configuration (Deklarativ Bəzədicilər)

NestJS-də konfiqurasiyalar mürəkkəb funksiyalar əvəzinə təmiz, oxunaqlı bəzədicilərlə (Decorators) idarə olunur:

```typescript
@Controller('orders')
@UseGuards(JwtAuthGuard)           // 🛡️ Auth Yoxlanışı
@UseInterceptors(CacheInterceptor) // ⚡ Keşləmə Nəzarətçisi
@UsePipes(ValidationPipe)          // 🔄 Data Validation
export class OrderController {}
```

---

## 🎯 5. Yekun Xülasə (Qızıl Qaydalar)

1. **NestJS Platform-Agnostic-dir:** Yəni altda işləyən HTTP freymvorkundan asılı deyil.
2. **Fastify:** Çox böyük sorğu yükü olan layihələrdə Express-i əvəz etmək üçün istifadə olunur.
3. **Providers as Wrappers:** Xarici DB klientlərini `@Injectable()` servisinə çevirmək üçün geniş istifadə olunan pattern-dir.
4. **Decorator-Based Configuration:** Qısa və səliqəli kod yazılışını təmin edir (`@UseGuards`, `@UseInterceptors`).
