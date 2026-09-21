# ⚡ NestJS: Provider Scopes & Performance Optimization (#52)

Salam! **`52_best_way_use_providers`** dərsinə xoş gəldin!

Bu dərsdə NestJS-də Servislərin (Provider-lərin) yaddaşda necə yaradıldığını, **Singleton**, **Request Scope** və **Transient** anlamaqla tətbiqimizin **performansını necə maksimum səviyyədə saxlaya biləcəyimizi** öyrənəcəksən.

---

## 🎯 Bu Dərs Ümumilikdə Nə Deyir? (Özət)

Müəllim bu dərsdə sənə çox vacib bir arxitektura mesajı verir:

> **"NestJS-də bütün Servislər və Kontrollerlər standart olaraq tək bir nüsxə kimi (Singleton) yaradılır. Sən bunu məcburi olmadıqca `Scope.REQUEST` etmə! Əgər etsən, hər gələn istəkdə (HTTP request) NestJS sıfırdan yeni servis obyekti yaradacaq və bu da serverini yavaşladacaq!"**

---

## 🧠 0. Terminologiya: Klass, Obyekt, Nüsxə (Instance) Nədir?

Mövzunu tam başa düşmək üçün bu 3 anlayışı həyatdan misallarla tam qavramalıyıq:

### 📐 1. Class (Klass) = Memarlıq Cizgisi / Çertyoj
- Kodda yazdığın `class UsersService {}` sadəcə kağız üzərindəki **plana (cizgiyə)** bənzəyir.
- Bu plan kompyuterin operativ yaddaşında (RAM) yer tutmur. Bu sadəcə təlimatdır.

### 🏗️ 2. Instance (Nüsxə / Obyekt) = Cizgiyə Baxıb Tikilən Həqiqi Ev
- Kağızdakı plana baxıb küçədə kərpicdən **real bir ev tikəndə**, həmin ev **Instance (Nüsxə və ya Obyekt)** adlanır.
- JavaScript-də `new UsersService()` əmri veriləndə kompyuterin RAM yaddaşında canlı işləyən xüsusi bir yeşik (obyekt) yaradılır.
- **"Servis instance-ı yaradıldı"** və ya **"Servis obyekti yaradıldı"** demək — RAM-da həmin klassdan istifadə edilə bilən canlı bir obyektin düzəldilməsi deməkdir!

---

## 🏛️ 1. NestJS-də 3 Provider Scope-u Nədir?

NestJS-də servislərin yaşam müddəti (Lifetime / Scope) 3 cür ola bilər:

| Scope (Kapsam) | Yaranma Anı | Yaddaş Vəziyyəti | Performans |
| :--- | :--- | :--- | :--- |
| **`DEFAULT` (Singleton)** | Server işə düşəndə (Bootstrap) | Bütün istifadəçilər tək bir obyekt paylaşıram | 🚀 **Ən Yüksək (Məsləhət görülən)** |
| **`REQUEST`** | Hər HTTP istəyi gələndə | Hər istək üçün YENİ obyekt yaradılır, cavab gedən kimi silinir | 🐢 **Yavaş (Yaddaş yükü çoxdur)** |
| **`TRANSIENT`** | Servis hansısa klassa inject olunanda | Hər inject olunan yerə xüsusi müstəqil obyekt verilir | ⚖️ **Orta** |

---

## ⚙️ 2. Hər Bir Scope-un İzahı və Kod Nümunələri

### 🟢 A) DEFAULT Scope (Singleton Pattern) - Ən Yaxşı Yol!

Əgər `@Injectable()` daxilində heç nə yazmasan, NestJS avtomatik **`DEFAULT`** rejimi seçir.

```typescript
import { Injectable } from '@nestjs/common';

@Injectable() // 👈 Defolt olaraq Singleton-dur
export class ProductsService {
  getProducts() {
    return ['Phone', 'Laptop'];
  }
}
```

- **Necə işləyir?** Server başlatdıqda `ProductsService`-dən yaddaşda (RAM) cəmi **1 dənə obyekt** yaradılır. 100,000 istifadəçi eyni anda sayta gəlsə belə, hamısı həmin tək obyektlə işləyir.
- **Üstünlüyü:** İnanılmaz dərəcədə sürətlidir və RAM-ı doldurmur.

---

### 🟡 B) REQUEST Scope (`Scope.REQUEST`)

Bəzən dərslərdə və ya bəzi ssenarilərdə Hər HTTP Request üçün fərqli servis instance-ı yaratmaq istəyirlər:

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST }) // 👈 Hər HTTP request-də təzədən yaradılır!
export class UsersService {
  // Hər gələn istəkdə bu constructor sıfırdan işə düşür
  constructor() {
    console.log('Yeni HTTP istəyi gəldi, UsersService yaradıldı!');
  }
}
```

və ya Custom Provider-lərdə:

```typescript
{
  provide: 'PRODUCT_TOKEN',
  useValue: ProductToken,
  scope: Scope.REQUEST, // 👈 Request scope
}
```

#### ⚠️ DƏHŞƏTLİ TƏSİRİ: "Scope Bubble" (Köpük Effekti)
Əgər sən bir Servisi `Scope.REQUEST` etsən, **həmin servisi daxilinə import edən bütün Kontrollerlər və digər Servislər də zəncirvari olaraq `REQUEST` scope-una çevrilir!**

Yəni bircə kiçik servisi Request scope etməklə bütün proyektinin Singleton üstünlüyünü məhv edə bilərsən!

---

### 🔵 C) TRANSIENT Scope (`Scope.TRANSIENT`)

Bu rejimdə servis hər gələn HTTP istəyi üçün yox, **hər yerə inject olunanda müstəqil nüsxə alması** üçün istifadə olunur.

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  // Hər inject olunduğu yer üçün ayrıca xüsusi logger instance-ı olacaq
}
```

- `OrderService` və `UserService` hər ikisi `LoggerService` inject edirsə, ikisinə də tam ayrı-ayrı `LoggerService` obyektləri veriləcək.

---

## 💡 3. Bəs Niyə İnsanlar `Scope.REQUEST` İstifadə Edirlər? Və Alternativ Nədir?

### Yanlış Yanaşma (Niyə istifadə edirlər?):
Tələbələr və ya təcrübəsiz proqramçılar gələn HTTP istəyindəki **User ID**, **Token** və ya **Header** məlumatlarını birbaşa servisin daxilində `@Inject(REQUEST)` vasitəsilə tutmaq üçün Servisi `Scope.REQUEST` edirlər.

```typescript
// ❌ YANLIŞ & YAVAŞ YANAŞMA
@Injectable({ scope: Scope.REQUEST })
export class BadUserService {
  constructor(@Inject(REQUEST) private request: Request) {}

  getCurrentUser() {
    return this.request.user; // Hər request-də yeni servis yaradılır!
  }
}
```

### ✅ PEŞƏKAR YANAŞMA (Best Practice):
Servisi **Singleton** olaraq saxla! İstifadəçi məlumatlarını Kontrollerdən Servis funksiyasına **arqument (parametr) kimi ötür**:

```typescript
// ✅ DÜZGÜN & SÜRƏTLİ YANAŞMA
@Injectable() // Singleton! (Performans mükəmməldir)
export class GoodUserService {
  // Request obyekti daxildə yox, funksiyanın parametri kimi gəlir!
  getUserProfile(userId: string) {
    return this.db.findUser(userId);
  }
}

// Controller-də:
@Controller('users')
export class UsersController {
  constructor(private readonly userService: GoodUserService) {}

  @Get('profile')
  getProfile(@Req() req) {
    // Parameter kimi ötürürük:
    return this.userService.getUserProfile(req.user.id);
  }
}
```

---

## 📌 Qızıl Qaydalar (Senior Backend Qeydləri)

1. **99% hallarda Servislərini `DEFAULT` (Singleton) saxla!**
2. **`Scope.REQUEST`-dən qaçın!** Çünki hər istəkdə Node.js Garbage Collector yaddaşı təmizləməyə məcbur olur və serverin response time-ı (gecikməsi) artır.
3. Servis daxilində request-yönümlü dataya ehtiyac varsa, bunu **funksiya parametr kimi ötür** (Controller ➔ Service).
4. İllərlə işləyən böyük sistemlərdə per-request context lazımdırsa, NestJS Scope əvəzinə Node.js-in doğma **`AsyncLocalStorage`** mexanizmindən istifadə edilir.
