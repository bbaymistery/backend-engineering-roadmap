# ⚡ Injection Scopes & Performance in NestJS (#68)

Bu sənəddə NestJS-də Provider-lərin yaddaş (RAM) idarəçiliyini, **`Scope.DEFAULT`**, **`Scope.REQUEST`**, **`Scope.TRANSIENT`** fərqlərini və **Cascading Effect (Kaskad Effekti)** performans riskini öyrənirik.

---

## 1️⃣ `Scope.DEFAULT` (Singleton Scope - Standart)

### Nədir?
- Tətbiq işə düşəndə (`bootstrap`) yalnız **1 dəfə** yaradılır.
- Server dayananadək eyni instansiya yaddaşda (RAM) qalır və gələn bütün sorğular həmin 1 obyektı istifadə edir.

### Üstünlükləri:
- 🚀 **Maksimal Sürət:** Sıfır obyekt yaratma xərci.
- 💾 **Minimum RAM:** Milyonlarla sorğu gəlsə də, RAM-da yalnız 1 obyekt qalır.

```typescript
@Injectable({ scope: Scope.DEFAULT }) // Standart olaraq belədir
export class UsersService {}
```

---

## 2️⃣ `Scope.REQUEST` (Request Scope - Hər Sorğuya Özəl)

### Nədir?
- Hər gələn HTTP sorğusunda (Request) NestJS **tam yeni instansiya** yaradır.
- Sorğu bitib cavab göndərildikdə həmin obyekt təmizlənir (**Garbage Collection**).

### Nə Vaxt Lazımdır?
- Hər HTTP sorğusundan istifadəçinin IP-sini, Tenant ID-sini, Auth Header-ini və ya Request-ID-sini daxildən oxumaq lazımdısa (`@Inject(REQUEST)`).

```typescript
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getTenantId() {
    return this.request.headers['x-tenant-id'];
  }
}
```

### ⚠️ DİQQƏT: Cascading Effect (Kaskad Effekti Və Performans Riski)!
Əgər bir `Singleton` servis (məs: `UsersService`) öz daxilində `Request-Scoped` bir servisi (məs: `TenantService`) `inject` edərsə:
➡️ **`UsersService` DƏ AVTOMATİK REQUEST-SCOPED OLUR!**
➡️ Və həmin `UsersService`-i inject edən **Controller də avtomatik Request-Scoped olur!**

Saniyədə 10,000 sorğu gələrsə, 10,000 dəfə Controller, 10,000 dəfə Service yaradılacaq və Node.js-in Garbage Collector-u çökmə dərəcəsinə gələcək!

---

## 3️⃣ `Scope.TRANSIENT` (Transient Scope - Hər İnyeksiyaya Özəl)

### Nədir?
- Bu servis harada `constructor`-da inject olunursa, həmin an **tam yeni instansiya** verilir.
- Request Scope-dan fərqli olaraq, kaskad effekti yaranmır, Singleton servis daxilində də istifadə oluna bilər.

### Nə Vaxt Lazımdır?
- Stateful (daxilində daxili vəziyyət tutan), thread-unsafe olan və ya hər komponent üçün ayrıca instance tələb edən utilitlər (məsələn: xüsusi Taymer / Stopwatch servisləri).

```typescript
@Injectable({ scope: Scope.TRANSIENT })
export class StopwatchService {
  private startTime = Date.now();

  getElapsedMs() {
    return Date.now() - this.startTime;
  }
}
```

---

## 📊 Xülasə Və Tövsiyələr (Best Practices)

1. **95%+ hallarda `Scope.DEFAULT` istifadə et!** NestJS-in ən sürətli rejimidir.
2. **`Scope.REQUEST`-dən mümkün qədər qaçın!** Əgər yalnız Request parametri lazımdırsa, onu servisin konstruktoruna yox, metodun arqumentinə `service.doSomething(req)` kimi ötürmək 100 dəfə daha sürətlidir.
3. **Cascading Effekti unutma!** Request Scoped provider bütün tətbiq zəncirini özünə tabe edir.
