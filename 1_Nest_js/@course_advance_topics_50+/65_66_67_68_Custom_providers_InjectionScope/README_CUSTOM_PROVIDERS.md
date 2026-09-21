# 🧩 Custom Providers in NestJS (#65, #66, #67)

Bu sənəddə Custom Provider-lərin **bütün 4 növünü (`useValue`, `useClass`, `useFactory`, `useExisting`)** və **Non-Class Tokens (Symbol/String)** mövzularını kodlar və ssenarilər ilə dərindən öyrənirik.

---

## 1️⃣ Value Provider (`useValue`)

### Nə zaman istifadə olunur?
- Konfiqurasiya obyektlərini inject edərkən,
- Uzaqdan gələn sabit API key/URL məlumatlarını inject edərkən,
- Unit testlərdə gerçək servis əvəzinə **Mock Obyekt** yerləşdirərkən.

### 🛠️ Nümunə:
```typescript
// app.module.ts
export const APP_CONFIG = 'APP_CONFIG';

@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'https://api.domain.com',
        timeout: 3000,
      },
    },
  ],
})
export class AppModule {}

// users.service.ts-də daxil edilməsi:
@Injectable()
export class UsersService {
  constructor(@Inject(APP_CONFIG) private readonly config: any) {
    console.log(this.config.apiUrl); // "https://api.domain.com"
  }
}
```

---

## 2️⃣ Class Provider (`useClass`)

### Nə zaman istifadə olunur?
- **Polimorfizm:** İnterfeysin arxasında duran konkret klassı dinamik dəyişmək istədikdə.
- Mühitə görə (Environment: DEV / STAGING / PROD) müxtəlif servislər işlətmək lazımdısa.

### 🛠️ Nümunə:
```typescript
// payment.module.ts
@Module({
  providers: [
    {
      provide: PaymentService, // İnterfeys və ya Baza klass tokeni
      useClass: process.env.NODE_ENV === 'production'
        ? StripePaymentService   // Production-da Stripe işləyir
        : MockPaymentService,   // Dev/Test-də Mock işləyir
    },
  ],
})
export class PaymentModule {}
```

---

## 3️⃣ Factory Provider (`useFactory`)

### Nə zaman istifadə olunur?
- Provider obyektinin yaradılması **Asinkron (async/await)** olduqda (məsələn: bazaya qoşulub connection almaq).
- Provider obyektinin yaradılması başqa servislərdən (`ConfigService`, `HttpService`) asılı olduqda.

### 🛠️ Nümunə:
```typescript
// database.module.ts
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get('DATABASE_URL');
        const connection = await createDbConnection(dbUrl); // Asinkron yaradılma
        return connection;
      },
      inject: [ConfigService], // useFactory funksiyasına ötürülən asılılıqlar
    },
  ],
})
export class DatabaseModule {}
```

---

## 4️⃣ Existing / Alias Provider (`useExisting`)

### Nə zaman istifadə olunur?
- Mövcud provider üçün yeni bir **Alias (Ləqəb / İkinci ad)** yaradarkən. Yalnız 1 instansiya qalır, amma 2 fərqli token ilə daxil edilə bilir.

### 🛠️ Nümunə:
```typescript
@Module({
  providers: [
    LoggerService,
    {
      provide: 'AliasedLogger',
      useExisting: LoggerService, // Yaxşı: Eyni instansiyaya istinad edir!
    },
  ],
})
export class AppModule {}
```

---

## 🔑 5. Non-Class Tokens & `Symbol()` İstifadəsi

TypeScript-də `interface` kompiyasiya olunduqda JavaScript kodundan **silinir (Type Erasure)**. Buna görə də `interface`-lər DI token kimi istifadə oluna BİLMƏZ!

### ❌ Səhv Yanaşma:
```typescript
constructor(private readonly paymentService: PaymentInterface) {} // XƏTA! TypeScript Interface run-time-da yoxdur.
```

### ✅ Peşəkar Həll: `Symbol` Token
```typescript
// payment.tokens.ts
export const PAYMENT_SERVICE_TOKEN = Symbol('PAYMENT_SERVICE_TOKEN');

// payment.module.ts
providers: [
  {
    provide: PAYMENT_SERVICE_TOKEN,
    useClass: StripePaymentService,
  }
]

// users.service.ts
constructor(
  @Inject(PAYMENT_SERVICE_TOKEN) private readonly paymentService: PaymentInterface
) {}
```
