# 🔄 ⚡ 🏁 NestJS Lifecycle Events & Graceful Shutdown (#71)

Salam! **`71_Lifecycle Events`** dərsinə xoş gəldin!

NestJS tətbiqləri işə düşərkən (Startup/Bootstrap) və dayandırılarkən (Shutdown) müəyyən mərhələlərdən (Phases) keçir.

Biz bu mərhələlərə qoşularaq (**Lifecycle Hooks**) tətbiq başladıda verilənlər bazasına qoşula, keş yaddasını hazırlaya, dayandırıldıqda isə açıq qoşulmaları zərərsiz şəkildə bağlaya bilərik (**Graceful Shutdown**).

---

## 📊 Həyat Dövrü İcra Sırası (Lifecycle Execution Order)

NestJS-də həyat dövrü 2 əsas mərhələyə bölünür:

```
┌────────────────────────────────────────────────────────┐
│               1. İŞƏ DÜŞMƏ (BOOTSTRAP PHASE)            │
├────────────────────────────────────────────────────────┤
│ 1. Instantiation (Obyektlərin yaradılması)             │
│ 2. onModuleInit()           ──> Modullar iniciallaşır  │
│ 3. onApplicationBootstrap() ──> HTTP server dinləyir   │
└────────────────────────────────────────────────────────┘
                           │
                 [ App İşləyir / Running ]
                           │
             (app.close() və ya SIGINT/SIGTERM)
                           │
┌────────────────────────────────────────────────────────┐
│             2. DAYANDIRILMA (SHUTDOWN PHASE)           │
├────────────────────────────────────────────────────────┤
│ 4. onModuleDestroy()                                   │
│ 5. beforeApplicationShutdown(signal)                   │
│ 6. HTTP Server təzə sorğuları dayandırır              │
│ 7. onApplicationShutdown(signal) ──> DB bağlanır       │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 1. İŞƏ DÜŞMƏ HAKLARI (Bootstrap Hooks)

### 1️⃣ `onModuleInit()`
* **Nə zaman çağırılır?** Modulun daxilindəki bütün asılılıqlar (dependencies) həll edildikdən və obyektlər yaradıldıqdan dərhal sonra.
* **Nə üçün istifadə olunur?** Verilənlər bazasına qoşulmaq, uzaq API klientini (SDK) iniciallaşdırmaq və ya Redis keşini isitmək (warm-up) üçün.
* **Qeyd:** `async` dəstəkləyir! NestJS bu metod tam həll olunana (resolve) qədər tətbiqin işə düşməsini gözləyir.

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    console.log('🟡 DB qoşulması başlayır...');
    await this.connectToDatabase();
    console.log('🟢 DB bağlandı!');
  }
}
```

### 2️⃣ `onApplicationBootstrap()`
* **Nə zaman çağırılır?** Bütün modullar `onModuleInit`-dən keçdikdən və HTTP server klient sorğularını dinləməyə başlamazdan dərhal əvvəl.
* **Nə üçün istifadə olunur?** Sistem sağlamlıq yoxlaması (Health check), avtomatik Cron/Worker başlatmaq üçün.

---

## 🏁 2. DAYANDIRILMA HAKLARI & GRACEFUL SHUTDOWN (Shutdown Hooks)

Tətbiq serverdə (məsələn Docker / Kubernetes-də) dayandırıldıqda (CTRL+C və ya `SIGTERM` siqnalı gəldikdə), aktiv istifadəçi sorğularının yarımçıq kəsilməməsi və verilənlər bazası qoşulmalarının təhlükəsiz bağlanması **Graceful Shutdown** adlanır.

### ⚠️ ÇOX VACİB: `main.ts`-də Dinləyicini Aktiv Etmək:

NestJS-də Shutdown hook-larının işləməsi üçün `main.ts`-də **`app.enableShutdownHooks()`** yazılmalıdır!

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔴 ÇOX VACİB: OS siqnallarını (SIGINT, SIGTERM) tutmaq üçün:
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
```

---

### 3️⃣ `onModuleDestroy()`
* Server dayandırılma siqnalı aldıqda **İLK çağırılan** hook-dur.

### 4️⃣ `beforeApplicationShutdown(signal)`
* Şəbəkə portsları (HTTP listener) bağlanmazdan dərhal əvvəl çağırılır. Siqnal adını (məs: `'SIGTERM'`) arqument kimi qəbul edir.

### 5️⃣ `onApplicationShutdown(signal)`
* HTTP Server tam qapandıqdan sonra, Node.js prosesi sonlanmazdan əvvəl icra olunur.
* **Nə üçün istifadə olunur?** Verilənlər bazası bağlantısını təhlükəsiz bağlamaq (`db.close()`), Redis bağlantısını sonlandırmaq üçün ən ideal yerdir.

```typescript
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    console.log(`🔴 Server dayandırılır (${signal}). DB bağlantısı bağlanır...`);
    await this.db.close();
    console.log('🏁 DB bağlantısı bağlandı. Təhlükəsiz dayandırıldı!');
  }
}
```

---

## 📊 Xülasə Cədvəli (Cheat-Sheet)

| Hook İnterfeysi | Metod Adı | Çağırılma Anı | Ən Yaxşı İstifadə Yeri |
| :--- | :--- | :--- | :--- |
| **`OnModuleInit`** | `onModuleInit()` | Modul hazır olan kimi | DB qoşulması, SDK init, Cache warm-up |
| **`OnApplicationBootstrap`** | `onApplicationBootstrap()` | Server dinləməyə başlamazdan əvvəl | Background Cron, Health check |
| **`OnModuleDestroy`** | `onModuleDestroy()` | Dayandırılma başlayan kimi | Taymerləri dayandırmaq |
| **`BeforeApplicationShutdown`**| `beforeApplicationShutdown()`| Şəbəkə qapanmazdan əvvəl | Siqnal analizi (SIGTERM/SIGINT) |
| **`OnApplicationShutdown`** | `onApplicationShutdown()` | Şəbəkə qapandıqdan sonra | `db.close()`, Redis disconnect (Graceful Shutdown) |
