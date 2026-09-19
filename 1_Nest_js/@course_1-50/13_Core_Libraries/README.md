# 📘 13 - NestJS Core Libraries Overview

Bu sənəd NestJS ekosistemində yer alan **`@nestjs/*` paketlərinin**, onların rolu və bir-biri ilə necə bağlandığının ətraflı izahını əhatə edir.

---

## 🎯 What You'll Learn

* 📦 **Overview of all `@nestjs/*` packages** (Bütün NestJS rəsmi paketləri).
* ⚙️ **Role of each core library** (Hər bir kitabxananın layihədəki rolu).
* 🔗 **How libraries connect together** (Paketlərin bir-biri ilə inteqrasiyası).

---

## Topic 1.1: Core Packages Overview

NestJS freymvorku modulyar paketlərdən ibarətdir. Əsas paketlər və meşğul olduqları sahələr:

| Package | Purpose | Azərbaycan Dildə İzahı |
| :--- | :--- | :--- |
| **`@nestjs/core`** | Core functionality, DI container, application context | NestJS-in ürəyi (DI Container, NestFactory, Application Context). |
| **`@nestjs/common`** | Decorators, pipes, guards, interceptors, exceptions | Bütün əsas dekoratorlar (`@Injectable`, `@Controller`), Pipe, Guard, Filterlər. |
| **`@nestjs/platform-express`** | Express adapter (default HTTP platform) | Defolt HTTP server adapteri (Express.js). |
| **`@nestjs/platform-fastify`** | Fastify adapter (alternative HTTP platform) | Yüksək sürətli alternativ HTTP server adapteri (Fastify). |
| **`@nestjs/testing`** | Testing utilities and module compilation | Avtomatik testlər üçün daxili modul kompilyatoru və utilitlər. |
| **`@nestjs/microservices`** | Microservices support (TCP, Redis, NATS, RabbitMQ) | Mikroxidmət (Microservices) dəstəyi (TCP, Redis, RabbitMQ, NATS). |
| **`@nestjs/websockets`** | WebSocket support with Socket.io/WS | Canlı (Real-time) daxili çat və WebSocket inteqrasiyası (Socket.io). |
| **`@nestjs/graphql`** | GraphQL integration | GraphQL API dəstəyi və sxem generatoru. |
| **`@nestjs/typeorm`** | TypeORM database integration | SQL Verilənlər bazası (PostgreSQL, MySQL) inteqrasiyası. |
| **`@nestjs/mongoose`** | MongoDB/Mongoose integration | NoSQL Verilənlər bazası (MongoDB) inteqrasiyası. |
| **`@nestjs/config`** | Configuration management | `.env` fayllarını idarə etmək üçün mərkəzi konfiqurasiya paketi. |
| **`@nestjs/swagger`** | OpenAPI/Swagger documentation | API sənədləşdirməsini avtomatik yaradan Swagger paketi. |

---

## Topic 1.2: `@nestjs/core` - The Heart of NestJS

`@nestjs/core` paketi NestJS freymvorkunun mərkəzi mühərrikidir. Buradan daxil edilən əsas komponentlər:

```typescript
import {
  NestFactory,         // Application factory (Tətbiqi yaradan fabrik)
  NestApplication,     // Application instance (Tətbiqin obyekti)
  ModuleRef,           // Module reference for dynamic providers (Dinamik provayder keçidi)
  Reflector,           // Metadata reflection utility (Metadatanı oxuyan utilit)
} from '@nestjs/core';
```

---

### 🚀 1. NestFactory (Tətbiqi Başlatma Seçimləri)

`NestFactory` tətbiqi 4 fərqli rejimdə başlatmağa imkan verir:

```typescript
// main.ts - Bootstrap application
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 1. Standard HTTP application (Standart Web Server)
  const app = await NestFactory.create(AppModule);

  // 2. With options (Loqlama, CORS və s. parametrlərlə)
  const appWithOptions = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    cors: true,
  });

  // 3. Microservice (Mikroxidmət kimi başlatmaq - TCP/RabbitMQ)
  const microservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
  });

  // 4. Standalone (no HTTP) - Konsol / Script / Cron job üçün HTTP-siz tətbiq
  const standalone = await NestFactory.createApplicationContext(AppModule);

  await app.listen(3000);
}
bootstrap();
```

#### 💡 Haçan hansını istifadə etməli?
- **`NestFactory.create()`**: Veb saytlar və REST API üçün (Ən çox istifadə olunan).
- **`NestFactory.createMicroservice()`**: RabbitMQ, Kafka və ya TCP vasitəsilə başqa servislərlə danışan Backend Mikroxidmətləri üçün.
- **`NestFactory.createApplicationContext()`**: HTTP server lazımsız olduqda (məsələn: Gecə işləyən fonsal tapşırıqlar - Cron Jobs və ya CLI skriptləri üçün).

---

### 🔄 2. ModuleRef (Dinamik və Runtime-da Servis Tapmaq)

`ModuleRef` — proqramın icra vaxtında (Runtime) DI Container-dən servisləri dinamik olaraq almağa imkan verir.

```typescript
import { Injectable } from '@nestjs/common';
import { ModuleRef, ContextId } from '@nestjs/core';
import { UserService } from './user.service';
import { RequestService } from './request.service';

@Injectable()
export class DynamicService {
  constructor(private moduleRef: ModuleRef) {}

  getService() {
    // 🟢 Get provider at runtime (Singleton servisi dinamik tapmaq)
    return this.moduleRef.get(UserService);
  }

  async resolveScoped(contextId: ContextId) {
    // 🟢 Resolve request-scoped provider (Hər sorğuya özəl servisi tapmaq)
    return this.moduleRef.resolve(RequestService, contextId);
  }
}
```

---

## Topic 1.3: `@nestjs/common` - Decorators & Utilities

`@nestjs/common` paketi NestJS proqramlaşdırmasında hər gün istifadə etdiyimiz bütün dekoratorlar, interfeyslər və utilitləri özündə toplayır.

```typescript
import {
  // Module & Injectable (Modul və Servis elan etmək üçün)
  Module, Injectable, Controller,

  // HTTP Decorators (HTTP metodları və sorğu parametrləri üçün)
  Get, Post, Put, Delete, Patch,
  Body, Query, Param, Headers,

  // Lifecycle Hooks (Tətbiqin yaşam dövrü hadisələri)
  OnModuleInit, OnModuleDestroy,
  OnApplicationBootstrap, OnApplicationShutdown,

  // Enhancers (Təhlükəsizlik və məlumat emalı üçün)
  UseGuards, UsePipes, UseInterceptors, UseFilters,

  // DI (Dependency Injection üçün köməkçi dekoratorlar)
  Inject, Optional, forwardRef,

  // Scope (Servisin ömrünü idarə etmək: DEFAULT, REQUEST, TRANSIENT)
  Scope,
} from '@nestjs/common';
```

---

## Topic 1.4: Platform Adapters (Express vs Fastify)

NestJS HTTP freymvorklarından asılı olmadan işləyir (Platform Agnostic). O, daxildə **Express.js** və ya **Fastify** mühərrikini adapter vasitəsilə istifadə edə bilir.

### 1. Express (Default - Susmaya Görə)
NestJS susmaya görə **Express.js** mühərrikindən istifadə edir:

```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.listen(3000);
}
bootstrap();
```

### 2. Fastify (Alternative - Yüksək Sürətli Alternativ)
Express-dən 2-3 dəfə daha sürətli işləyən **Fastify** mühərriki:

```typescript
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  // ⚠️ QEYD: Fastify işlədərkən 0.0.0.0 hostunu qeyd etmək vacibdir!
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

#### 💡 Express vs Fastify Müqayisəsi:
- **Express**: Ən populyar, 100,000-lərlə middleware və kitabxana dəstəyi var (Tövsiyə olunur).
- **Fastify**: Yüksək performans (High Throughput) tələb olunan böyük yük altında işləyən servislər üçün (2x-3x daha sürətli saniyədə sorğu emalı).
