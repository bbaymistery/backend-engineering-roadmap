# 💉 NestJS: Custom Providers & Dependency Injection (#53)

Salam! **`53_custom_providers`** dərsinə xoş gəldin!

Bu dərsdə NestJS-in ən güclü cəhəti olan **Dependency Injection (Asılılıqların İnyeksiyası)** mexanizminin dərinliklərinə enəcəyik. **Provider nədir**, **Custom Provider nə üçün lazımdır**, **`useValue`**, **`useClass`**, **`useExisting`**, **`useFactory`** və **Non-Class Tokens (Klass Olmayan Tokenlər)** anlayışlarını sıfırdan öyrənəcəksən.

---

## ❓ 1. Provider Nədir?

NestJS-də **Provider** — başqa klasslara (məsələn, Controller-lərə) **inject (dəstək)** edilə bilən hər şeydir! 
Servislər, Repozitoriyalar, Helperlər, Factory-lər — hamısı birer Provider-dir.

### Standart Provider (Nə Baş Verir?):
Adətən biz servisi belə yazırıq:

```typescript
@Injectable()
export class CatsService {
  getCats() { return ['Garfield', 'Tom']; }
}
```

Və `AppModule`-də qeydiyyatdan keçiririk:

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService], // 👈 Standart yazılış
})
export class AppModule {}
```

#### 🕵️ Müəllimin Pərdə Arxası Sirri:
NestJS arxaplanda `providers: [CatsService]` kodunu **avtomatik olaraq bu formaya çevirir**:

```typescript
providers: [
  {
    provide: CatsService, // 📍 Token (Tapmaq üçün Açar adı)
    useClass: CatsService, // 📍 Yaradılacaq Klass
  }
]
```
Yəni standart istifadədə `CatsService` həm **Token (Açar)**, həm də **İcra ediləcək Klass** rolunu oynayır.

---

## ⚡ 2. Bəs Custom Provider Nədir və Niyə Lazımdır?

Əgər standart `providers: [CatsService]` bizə kifayət edirsə, niyə Custom Provider lazımdır?

**Aşağıdakı hallarda Standart Provider YARAMIR:**
1. Klass yox, sadə bir **Obyekt**, **Konstanta** və ya **Konfiqurasiya** inject etmək istəyirsən (`useValue`).
2. Test yazarkən real Servis əvəzinə **Mock (Saxta) Servis** vermək istəyirsən (`useClass`).
3. Mənbəni dinamik olaraq başqa bir mövcud servisə bağlamaq istəyirsən (`useExisting`).
4. Servis obyektini **dinamik/asinxron (Factory)** olaraq hesablamaq istəyirsən (`useFactory`).
5. Açar söz olaraq Klass adı yox, **String ('CONNECTION') və ya Symbol** istifadə etmək istəyirsən (**Non-class-based token**).

---

## 🛠️ 3. Custom Provider Növləri və Kod Nümunələri

### 1️⃣ `useValue` (Klass Olmayan Dəyərlərin İnyeksiyası & Non-Class Token)

Əgər bir klass yox, sadə obyekt və ya baza konfiqurasiyası inject etmək istəyirsənsə:

#### Module-da Qeydiyyat:
```typescript
const connectionConfig = {
  port: 5432,
  host: 'localhost',
};

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION', // 👈 String Token (Klass deyil!)
      useValue: connectionConfig,    // 👈 Birbaşa obyekt veririk
    },
  ],
})
export class AppModule {}
```

#### Controller və ya Service-də Oxunması:
Klass olmayan String tokenləri oxumaq üçün **`@Inject()`** dekoratorundan istifadə edirik:

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    // 💡 NestJS-dən 'DATABASE_CONNECTION' etiketli dəyəri gətirməsini istəyirik
    // Və gələn dəyəri 'dbConfig' adında öz dəyişənimizə mənimsədirik!
    @Inject('DATABASE_CONNECTION') private readonly dbConfig: any, 
  ) {
    console.log(this.dbConfig.port); // 5432
  }
}
```

---

### 🔍 "dbConfig hardan geldi? connectionConfig nə alaqədir?" (ÇOX VACİB İZAH)

Əgər bu hissədə başın qarışıbsa, bu xəritəyə bax:

```text
[ Module-da Təyin Edirik ]
provide: 'DATABASE_CONNECTION'  ───────────┐ (Token - Etiket Adı)
useValue: connectionConfig                │
                                          │ NestJS bunları bir-birinə bağlayır!
[ Service-də İstafədə Edirik ]            │
@Inject('DATABASE_CONNECTION') ────────────┘ (Gedib həmin etiketi tapır)
private readonly dbConfig                  <── Gələn connectionConfig obyektini bu dəyişənə qoyur!
```

#### ❓ Sual: `dbConfig` adını özümüz qoyuruq?
**BƏLİ!** `dbConfig` sadəcə bizim Servis daxilində verdiyimiz **dəyişən (parametr) adıdır**. İstəsən adını `myConn`, `configData` və ya `bazaMəlumati` də qoya bilərsən! 

Məsələn, tamamilə fərqli adla yazsaq da EYNİ İŞİ görəcək:

```typescript
@Injectable()
export class UsersService {
  constructor(
    // 'DATABASE_CONNECTION' etiketində nə varsa gətir 'gelenBazaConfigi' dəyişəninə yaz!
    @Inject('DATABASE_CONNECTION') private readonly gelenBazaConfigi: any,
  ) {
    // gelenBazaConfigi indi { port: 5432, host: 'localhost' } obyektidir!
    console.log(this.gelenBazaConfigi.host); // 'localhost'
  }
}
```

#### 💡 Qısa Xülasə:
1. **`'DATABASE_CONNECTION'`** ──► Qarderobdakı **Nömrə (Talon / Token)**.
2. **`connectionConfig`** ──► Qarderoba verdiyin **Paltar (Dəyər / Value)**.
3. **`dbConfig`** ──► Qarderobdan paltarını geri alanda onu tutan **Əlin (Dəyişən adı)**!

---

### 2️⃣ `useClass` (Polimorfizm & Test üçün Mocking)

Bir Interfeys/Klass altında fərqli real işləyən klasslar vermək üçün istifadə olunur. Məsələn, **Production**-da real baza servisini, **Testing** mühitində isə saxta (Mock) servisi qoşmaq üçün!

```typescript
const isTesting = process.env.NODE_ENV === 'test';

@Module({
  providers: [
    {
      provide: UsersService, // Token
      useClass: isTesting ? MockUsersService : RealUsersService, // 👈 Şərtə görə klass dəyişir!
    },
  ],
})
export class AppModule {}
```

---

### 3️⃣ `useExisting` (Mövcud Provider-ə Əhməd/Əli Ləqəbi Verilməsi - Alias)

Deyək ki, layihəndə köhnə bir `OldLogger` adında servis var və yeni `NewLogger` yaradıb hamısını bura yönləndirmək istəyirsən:

```typescript
@Module({
  providers: [
    NewLoggerService,
    {
      provide: OldLoggerService, // Kimse OldLogger istəsə...
      useExisting: NewLoggerService, // ...ona NewLogger-in eyni instance-nı ver!
    },
  ],
})
export class AppModule {}
```

---

### 4️⃣ `useFactory` (Dinamik və Asinxron Yaradılma)

Əgər provayderin yaradılması başqa servislərdən asılıdırsa və ya `async/await` ilə verilənlər bazasına qoşulub obyekti qaytarmalıdırsa:

```typescript
@Module({
  providers: [
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const connection = await createDbConnection(configService.get('DB_URL'));
        return connection;
      },
      inject: [ConfigService], // 👈 Factory funksiyasına lazım olan asılılıqlar
    },
  ],
})
export class AppModule {}
```

---

## ❓ 4. Əlavə: Optional Providers (`@Optional()`)

Bəzən inject edilən provider layihədə mövcud olmaya bilər (məsələn, konfiqurasiya verilməyib) və bunun xəta verməsini istəmirsən:

```typescript
import { Injectable, Inject, Optional } from '@nestjs/common';

@Injectable()
export class HttpService {
  constructor(
    @Optional() @Inject('HTTP_OPTIONS') private readonly options?: any, // 👈 Tapılmasa xəta vermir, undefined olur
  ) {
    if (!this.options) {
      this.options = { timeout: 5000 }; // Default dəyər veririk
    }
  }
}
```

---

## 🎯 5. Qızıl Xülasə

| Növ | Nə Vaxt İstifadə Olunur? | Misal |
| :--- | :--- | :--- |
| **`useValue`** | Statik obyektlər, konstanta dəyərlər, konfiqurasiyalar üçün | `provide: 'CONFIG', useValue: { port: 3000 }` |
| **`useClass`** | Dinamik klass seçimi, Test üçün Mock klasslar | `provide: DbService, useClass: MockDbService` |
| **`useExisting`** | Bir provayderə başqa ad (Alias) vermək üçün | `provide: OldService, useExisting: NewService` |
| **`useFactory`** | Dinamik/Asinxron yaradılan provayderlər üçün | `useFactory: async () => await connect()` |
| **`@Inject('TOKEN')`** | Klass olmayan (String/Symbol) tokenləri oxumaq üçün | `constructor(@Inject('CONFIG') config)` |
| **`@Optional()`** | Olmasa da xəta verməyən ixtiyari provayderlər üçün | `@Optional() @Inject('OPT') opt` |
