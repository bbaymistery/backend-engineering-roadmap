# 🚀 🧩 ⚡ NestJS Master Guide: Custom Providers & Injection Scopes (#65, #66, #67, #68)

Salam! **`65_66_67_68_Custom_providers_InjectionScope`** mövzularına xoş gəldin!

NestJS-in ən böyük gücü onun **Dependency Injection (DI) Container** və **IoC (Inversion of Control)** mexanizmidir. Bir çox proqramçı yalnız standart `@Injectable()` yazaraq servislər yaradır. Lakin böyük enterprise və arxitekturalı layihələrdə standart sintaksis kifayət etmir.

Bu qovluqda 4 böyük mövzu birləşdirilib:
1. **Topic 65:** Standard Providers vs Custom Providers
2. **Topic 66:** Custom Provider Tipləri (`useValue`, `useClass`, `useFactory`, `useExisting`)
3. **Topic 67:** Non-Class Provider Tokens (String & Symbol Tokens, `@Inject`)
4. **Topic 68:** Injection Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) və Performans Təsiri

---

## 📚 Əlavə Detallı Sənədlər:
Daha dərin oxumaq və hər bir mövzunun kod nümunələrini araşdırmaq üçün hazırladığımız xüsusi qovluq sənədləri:
- 📖 **[README_CUSTOM_PROVIDERS.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/65_66_67_68_Custom_providers_InjectionScope/README_CUSTOM_PROVIDERS.md)** — Custom Providers (`useValue`, `useClass`, `useFactory`, `useExisting`) dərindən izahı.
- 📖 **[README_INJECTION_SCOPES.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/65_66_67_68_Custom_providers_InjectionScope/README_INJECTION_SCOPES.md)** — Injection Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) və performans sirləri.

---

## 🏗️ 1. Standard Provider vs Custom Provider Nədir?

### Standart Sintaksis (Short-hand Syntax):
```typescript
@Module({
  providers: [UsersService], // 👈 Qısa sintaksis
})
export class UsersModule {}
```

Fonda NestJS bunu **tam syntax**-a çevirir:
```typescript
providers: [
  {
    provide: UsersService, // Token (Klassın adı)
    useClass: UsersService // İcra olunacaq klass
  }
]
```

### Custom Provider Nə Vaxt Lazımdır?
1. Mövcud klassın əvəzinə başqa bir klass yükləmək istədikdə (məs: DEV-də `MockPaymentService`, PROD-da `StripePaymentService`).
2. Tətbiqə obyekt, konfiqurasiya və ya hazır uzaq API klientini (məs: SDK instance) inject etmək istədikdə (`useValue`).
3. Asılılıq asinkron olaraq bazadan və ya konfiqurasiyadan oxunaraq dinamik yaradılmalı olduqda (`useFactory`).
4. TypeScript Interface-lərini inject etmək istədikdə (`Symbol` token ilə).

---

## ⚙️ 2. Custom Provider-lərin 4 Əsas Növü

| Növ | Sintaksis | İstifadə Məqsədi / Ən Yaxşı Ssenari |
| :--- | :--- | :--- |
| **Value Provider** | `{ provide: 'API_KEY', useValue: 'secret123' }` | Statik obyekt, konfiqurasiya, mock verilənlər inject etmək üçün. |
| **Class Provider** | `{ provide: PaymentService, useClass: StripeService }` | Polimorfizm! Mühitdən (ENV) və ya şərtdən asılı olaraq başqa klass işlətmək. |
| **Factory Provider** | `{ provide: 'DB', useFactory: async (config) => ..., inject: [ConfigService] }` | Dinamik, asinkron və ya başqa servislərdən asılı yaradılan obyektlər. |
| **Existing Provider** | `{ provide: 'OldLogger', useExisting: NewLogger }` | Mövcud provider-ə yeni ad (Alias) vermək üçün. |

---

## ⚡ 3. Injection Scopes (İnyeksiya Sahələri)

NestJS-də obyektlərin yaddaşda (RAM) ömrü 3 formada idarə olunur:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NESTJS INJECTION SCOPES                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Scope.DEFAULT (Singleton - 95% hallarda)                           │
│    [ App Start ] ──> 1 Ədəd İnstansiya Yaradılır ──> (Hamı Paylaşır)  │
│                                                                        │
│ 2. Scope.REQUEST (Request-Scoped - Hər Sorğuya 1 Təzəsi)              │
│    [ HTTP Request ] ──> Yeni İnstansiya ──> [ Res Send ] ──> (Silinir) │
│                                                                        │
│ 3. Scope.TRANSIENT (Transient - Hər İnjection-a 1 Təzəsi)              │
│    [ Inject 1 ] ──> Insta-A   |   [ Inject 2 ] ──> Insta-B             │
└────────────────────────────────────────────────────────────────────────┘
```

### 📊 Scopes Müqayisə Cədvəli:

| Scope | Yaradılma Tezliyi | Performans (RAM / CPU) | Nə Vaxt İstifadə Olunur? |
| :--- | :--- | :--- | :--- |
| **`Scope.DEFAULT`** | Tətbiq işə düşəndə **1 dəfə**. | 🚀 **Ən Yüksək (Ultra Fast)** | 95%+ Bütün standart servislər, DB repositorilər. |
| **`Scope.REQUEST`** | Hər bir **HTTP Request-də 1 dəfə**. | ⚠️ **Zəif (Garbage Collection yükü)** | Hər HTTP sorğusundan headers, Tenant ID, IP oxumaq lazımdısa. |
| **`Scope.TRANSIENT`** | Hər daxil edilən (**Inject**) yerdə **1 dəfə**. | ⚖️ **Orta** | Stateful (vəziyyət saxlayan) və thread-unsafe utilitlər. |

---

## 🎯 Hansını Nə Zaman Seçməliyik? (Qərar Matrisi)

1. **Əgər statik obyekt və ya ENV konfiqurasiyası inject etmək istəyirsənsə:** ➡️ **`useValue`**
2. **Əgər İnterfeys arxasında DEV və PROD üçün müxtəlif servislər dəyişəcəksə:** ➡️ **`useClass`**
3. **Əgər baza qoşulması asinkron yaradılacaqsa:** ➡️ **`useFactory`**
4. **Əgər hər HTTP sorğusuna özəl Header oxuyan servis lazımdırsa:** ➡️ **`Scope.REQUEST`**
5. **Standart halda heç nə yazmırsan:** ➡️ Avtomatik **`Scope.DEFAULT`** (Singleton) olur!
