# ⚡ NestJS Interceptors Explained | Building Blocks (#27)

Salam! NestJS öyrənmə yolunda irəliləyən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`27_Interceptors_Explained_BuildingBlocks`** mövzusunu — NestJS-in ən güclü binalarından biri olan **Interceptor (Nəzarətçi)** anlayışını, onun **Pre-controller (əvvəl)** və **Post-controller (sonra)** iş rejimini, RxJS operatorlarınıvə real proyektlərdə 5 əsas istifadə ssenarisini sıfırdan öyrənəcəksən.

---

## 📝 1. Sənin `note.txt` Faylındakı Notlarının Analizi

Faylın daxilinə yazdığın notları nəzərdən keçirdik. **Sən mövzunun təməl məntiqini 100% tam dəqiqliklə başa düşmüsən!** 🎉

Gəl götürdüyün notları təsdiqləyək:

| Sənin Notun (`note.txt`)                                      |       Düzgündür?        | İzahı / Təsdiqi                                                                                                                                                    |
| :------------------------------------------------------------ | :---------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`request to interceptors go to controller`**                |   ✅ **100% Doğrudur**   | Sorğu serverə daxil olduqda Controller-ə çatmazdan **ƏVVƏL** Interceptor-dan keçir (Pre-controller logic).                                                         |
| **`then controller return response to interceptors`**         |   ✅ **100% Doğrudur**   | Controller öz işini bitirib cavab qaytardıqda, həmin cavab geriyə **Interceptor-a düşür** (Post-controller logic).                                                 |
| **`interceptor looks like middleware`**                       | ✅ **Mükəmməl Müşahidə** | Bəli, həqiqətən də sorğunun və cavabın ortasında durduğu üçün Middleware-ə bənzəyir, lakin RxJS `Observable` və Aspect-Oriented Programming (AOP) gücünə malikdir. |
| **`It is better make request lifecycle and show from there`** |    ✅ **Əla Təklif**     | Request Lifecycle daxilində Interceptor-un yerini dəqiq sxemlə göstərəcəyik.                                                                                       |

---

## 🔄 2. Request Lifecycle Daxilində Interceptor-un Yeri

Gəl notunda qeyd etdiyin kimi, Interceptor-un Sorğunun Ömür Dövründəki (Request Lifecycle) yerinə baxaq:

```text
[ HTTP Request Daxil Olur ]
            │
            ▼
     1. Middleware 
            │
            ▼
     2. Guards
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Interceptor (PRE-LOGIC)                                             │
│    - Sorğu Controller-dən ƏVVƏL buraya girir                            │
│    - Taymer başlayır: const now = Date.now()                            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
     4. Pipes ──► 5. Controller Handler ──► 6. Service & Database
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. Interceptor (POST-LOGIC - next.handle().pipe())                      │
│    - Controller cavab qaytardıqdan SONRA geriyə buraya düşür           │
│    - Cavab formatlanır: { data: result, success: true }                │
│    - Taymer bitirilir: Date.now() - now                                │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
     8. Exception Filters ──► [ HTTP Response Çıxır ]
```

---

## 🎯 3. Interceptor Nədir və Nə İşə Yarayır?

**Interceptor (Nəzarətçi)** — **Aspect-Oriented Programming (AOP)** konseptinə əsaslanan və NestJS-də `NestInterceptor` interfeysini tətbiq edən klasdır.

### 🌟 Interceptor-un 5 Əsas İmkana Sahibdir:
1. **İcradan əvvəl/sonra əlavə məntiq işlətmaq** (Logging / Benchmarking).
2. **Controller-dən qayıdan cavabı şəkilləndirmək** (Response Transformation).
3. **Controller-dən qayıdan xətaları tutub başqa xətaya çevirmək** (Exception Mapping).
4. **Çox uzanan sorğuları avtomatik ləğv etmək** (Timeout Handling).
5. **Məlumatı keşdən (Cache) qaytararaq Controller-i ümumiyyətlə çağırmamaq** (Caching).

---

## 💻 4. Canlı Kodlar və Addım-Addım İzahı

Sən üçün yaradılmış 4 kod faylına nəzər salaq:

---

### 1️⃣ `logging.interceptor.ts` — Vaxtı Ölçən Interceptor (Pre və Post Məntiqi)

Bu interceptor sorğunun Controller-ə getməzdən ƏVVƏL (`Pre`) və Controller-dən qayıtdıqdan SONRA (`Post`) müddətini ölçür:

```typescript
// 📄 logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. PRE-CONTROLLER: Controller-dən ƏVVƏL (Not #1)
    const now = Date.now();
    console.log(`📥 [PRE] Sorğu Controller-ə gedir...`);

    // 2. POST-CONTROLLER: Controller-dən SONRA (Not #2)
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        console.log(`📤 [POST] Controller cavab verdi! Müddət: ${delay}ms`);
      }),
    );
  }
}
```

---

### 2️⃣ `transform.interceptor.ts` — Cavabı Vahid Formatlaşdıran Interceptor

Controller sadəcə xam array/obyekt qaytarır. Interceptor həmin cavabı tutur və nizamlı standart JSON qutusuna salır:

```typescript
// 📄 transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        data: data,                       // Controller-dən gələn əsl data
        success: true,                    // Status indikatoru
        statusCode: response.statusCode,  // 200/201 statusu
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

---

### 3️⃣ `timeout.interceptor.ts` — Çox Uzanan Sorğuları Ləğv Edən Interceptor

Əgər Controller 5 saniyə (5000ms) ərzində cavab verməzsə, sorğu avtomatik ləğv edilir və `408 Request Timeout` atılır:

```typescript
// 📄 timeout.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // 5 saniyə gözləyir
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException('Sorğu çox vaxt apardı (Timeout 5s)!'));
        }
        return throwError(() => err);
      }),
    );
  }
}
```

---

### 4️⃣ `user.controller.ts` — Interceptor-ların Controller-ə Bərkidilməsi

Controller-də `@UseInterceptors(...)` bəzədicisi vasitəsilə bərkidilir:

```typescript
// 📄 user.controller.ts
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { TransformInterceptor } from './transform.interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor) // 👈 Interceptor-lar aktiv edildi
export class UserController {

  @Get()
  getAllUsers() {
    return [{ id: 1, name: 'Ali' }, { id: 2, name: 'Vəli' }];
  }
}
```

---

## 🎯 5. Yekun Xülasə (Qızıl Qaydalar)

1. **Not 1 Təsdiqi:** Sorğu Controller-dən **əvvəl** Interceptor-un daxilinə girir (`intercept()` metodunun ilk hissəsi).
2. **Not 2 Təsdiqi:** Controller icranı bitirdikdə cavab geriyə Interceptor-un **`next.handle().pipe(...)`** hissəsinə düşür.
3. **Not 3 Təsdiqi:** Middleware-ə oxşayır, amma **RxJS operatorları (`map`, `tap`, `catchError`)** sayəsində cavabı tamamilə dəyişdirə bilir.
4. **Ən Çox İstifadə Ssenariləri:** Logging (vaxt ölçmək), Response Formatlama, Timeout, Caching.
