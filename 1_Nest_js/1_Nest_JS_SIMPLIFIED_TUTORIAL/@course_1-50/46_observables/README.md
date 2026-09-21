# 🌊 NestJS: Observables & RxJS Explained (#46)

Salam! **`46_observables`** dərsinə xoş gəldin!

Əgər *"Observables (RxJS) nədir və bunun NestJS ilə nə əlaqəsi var?"* deyə düşünürsənsə, tamamilə təbii bir sualdır. Çünki proqramçıların çoxu Javascript-də yalnız `Promise` (async/await) istifadə etməyə vərdiş edib.

Bu sənəddə **Observable nədir**, **Promise-dən fərqi nədir** və **NestJS-də harada istifadə olunur** sorularına ən sadə dildə cavab tapacaqsan.

---

## ❓ 1. Observables-in NestJS İlə Nə Əlaqəsi Var?

NestJS arxa planda **RxJS (Reactive Extensions for JavaScript)** kitabxanasından istifadə edir. NestJS-də 3 mühüm yerdə Observables qarşına çıxır:

1. **Interceptors (Ən Əsas Yer):**
   NestJS-də gələn və gedən sorğuları formatlamaq üçün yazdığımız Interceptor-lar `intercept(context, next): Observable<any>` qaytarır.
2. **Microservices (Mikroservislər):**
   Mikroservislər arası mesajlaşmada (`ClientProxy.send()`) data axını `Observable` şəklində ötürülür.
3. **HTTP Module (`@nestjs/axios`):**
   Xarici API-lərə sorğu atarkən (`HttpService.get()`) cavab Promise kimi yox, `Observable` kimi gəlir.

---

## 🆚 2. Promise vs Observable (Ən Sadə Analogiya)

| Xüsusiyyət              | Promise (`async / await`)                                          | Observable (`RxJS`)                                                      |
| :---------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **Həyati Analogiya**    | **Restoranda Yemek Sifarişi:** Yeməyi 1 dəfə gətirirlər, iş bitdi. | **Su Krantı / YouTube Live Stream:** Krantı açırsan, su dayanmadan axır. |
| **Dəyər Sayı**          | Yalnız **1 dəyər** qaytarır (Resolve və ya Reject).                | Zamanla **birdən çox (0, 1, 100...) dəyər** axıada bilər.                |
| **Ləğv Edilə Bilirmi?** | **XEYR!** Başlamış Promise-i yarıda ləğv etmək olmur.              | **BƏLİ!** `unsubscribe()` ilə istənilən an axını dayandırmaq olur.       |
| **Operatorlar**         | Yoxdur (`.then()` / `.catch()`).                                   | Nəhəng operator dəsti var (`map`, `tap`, `filter`, `catchError`).        |

---

## ⚙️ 3. Observable Necə İşləyir? (3 Kanal)

Bir Observable zamanla aşağıdakı 3 hadisəni yaya (emit) bilər:

```text
[ Data Stream (Axın) ] ──► next(1) ──► next(2) ──► next(3) ──► complete()
                                                           │
                                                           └──► error(Xəta)
```

1. **`next(data)`:** Yeni data gəldi! (Zamanla dəfələrlə çağırıla bilər).
2. **`error(err)`:** Xəta baş verdi! (Axın dayandı).
3. **`complete()`:** Axın uğurla bitdi! (Daha data gəlməyəcək).

---

## 🛠️ 4. NestJS-də Ən Çox İşlənən RxJS Operatorları

1. **`map()`:** Controller-dən çıxan cavabı dəyişdirib vahid JSON formatına salır.
2. **`tap()`:** Cavaba toxunmadan yan təsir (Side-effect) yaradır (Məsələn: Sorğunun icra vaxtını loglayır).
3. **`catchError()`:** Baş verən xətanı tutub başqa formaya salır.
4. **`firstValueFrom()`:** Observable-i standart JavaScript `Promise`-inə (async/await) çevirir.

---

## 💻 5. Nümunə Kodlar

### A) NestJS Interceptor-da Observable (`map` & `tap`)

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      // 1. tap: İcra müddətini loglayır (Dataya toxunmur)
      tap(() => console.log(`⏱️ İcra müddəti: ${Date.now() - start}ms`)),
      
      // 2. map: Cavabı vahid formaya salır
      map((data) => ({
        success: true,
        result: data,
      })),
    );
  }
}
```

---

### B) Observable-ı Promise-ə Çevirmək (`firstValueFrom`)

Xarici API-dən data çəkəndə Observable gəlir. Biz onu `async/await` ilə belə işlədirik:

```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async getExternalData() {
    // HttpService Observable qaytarır. firstValueFrom ilə onu Promise-ə çeviririk:
    const response = await firstValueFrom(
      this.httpService.get('https://api.example.com/data')
    );
    return response.data;
  }
}
```

---

## 🎯 6. Qızıl Xülasə

1. **Promise = 1 Dəyər** (Tək dəfəlik).
2. **Observable = Data Axını** (Zamanla gələn məlumatlar sırası).
3. **NestJS-də Interceptors** tamamilə RxJS Observables vasitəsilə işləyir.
4. Observable-i `async/await` kimi işlətmək üçün `firstValueFrom()` istifadə olunur.
