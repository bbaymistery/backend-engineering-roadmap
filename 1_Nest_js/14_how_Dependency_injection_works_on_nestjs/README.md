# 🎓 NestJS-də Dependency Injection (DI) necə işləyir? — Hərtərəfli Tədris Təlimatı

Salam dostum! NestJS dünyasına xoş gəldin. Əgər backend proqramlaşdırmaya yeni başlayırsansa, **Dependency Injection (DI)** və **Inversion of Control (IoC)** anlayışları sənə əvvəlcə mürəkkəb görünə bilər. 

Bu sənəddə **heç bir şəkil olmadan**, sırf aydın izahlar, canlı həyat analogiyaları və TypeScript kodları ilə NestJS-də DI-in nə olduğunu, arxada necə işlədiyini və daxili mexanizmini sıfırdan öyrənəcəksən.

---

## ❓ 1. Dependency Injection (DI) Nədir və Nə Üçün Lazımdır?

### 💡 Sadə Dildə Analogiya:
Təsəvvür et ki, bir **Restoran Aşpazısan (`UserService`)**. 
* **DI Olmadan:** Aşpaz xörək bişirmək üçün kartofu, əti özü fermaya gedib əkir, böyüdür və kəsir (`new UserRepository()`). Bu aşpazın işini inanılmaz dərəcədə çətinləşdirir!
* **DI İlə:** Aşpazın heç nə əkməyə ehtiyacı yoxdur. Restoranın **Təchizatçısı (NestJS DI Container)** təzə ərzaqları birbaşa aşpazın mətbəxinə (konstruktoruna) gətirib verir. Aşpaz sadəcə yemək bişirməklə məşğul olur.

---

## 🧐 "Hər vaxt DI yazmalıyıq? DI olmadan yazanlar varmı?"

### 💬 Əla Sual! Gəl cavablandıraq:

1. **Bəli, DI olmadan kod yazanlar var!**
   * Ənənəvi, kiçik **Node.js / Express.js** layihələrində və ya sadə skriptlərdə proqramçılar tez-tez DI istifadə etmir.
   * Onlar klassın içində `const db = new Database()` yazırlar. Çünki layihə balacadır və test yazmaq kimi tələblər yoxdur.

2. **Lakin böyük və peşəkar layihələrdə nələr baş verir?**
   * Əgər sən DI olmadan yazsan, 100 müxtəlif yerdə `new Database()` yazmalı olacaqsan. Sabah DB konfiqurasiyası dəyişəndə 100 yeri tək-tək dəyişməyə məcbur qalacaqsan!
   * **Test yazmaq imkansız olur:** Kodunu test edəndə real verilənlər bazasına qoşulmalı olursan ki, bu da testləri yavaşladır və təhlükəli edir.

3. **NestJS-də necədir?**
   * NestJS **tamamilə DI arxitekturası üzərində qurulub**. NestJS-də peşəkar kod yazmaq istəyiriksə, **DI istifadə etmək məcburidir və bu bizim işimizi dəfələrlə asanlaşdırır!**

---

## 🔴 2. DI Olmadan Yazılan Kod (Tight Coupling - Sıkı Bağlılıq)

Gəl ilk əvvəl DI **istifadə olunmayan** pis kod strukturuna baxaq:

```typescript
// ❌ PİS YANAŞMA: DI OLMANAN KOD
class UserRepository {
  getUser() {
    return { id: 1, name: 'Ali' };
  }
}

class CacheService {
  getCache(key: string) {
    return null;
  }
}

class UserService {
  private userRepo: UserRepository;
  private cacheService: CacheService;

  constructor() {
    // ❌ SƏHV: Service öz asılılıqlarını (dependency) ÖZÜ new edərək yaradır!
    this.userRepo = new UserRepository();
    this.cacheService = new CacheService();
  }

  findUser() {
    const cached = this.cacheService.getCache('user_1');
    if (cached) return cached;
    return this.userRepo.getUser();
  }
}
```

### ⚠️ Bu kodun 3 Böyük Problemi:
1. **Sıkı Bağlılıq (Tight Coupling):** `UserService` birbaşa `UserRepository` və `CacheService` klaslarına yapışıb. Sabah `UserRepository`-nin konstruktoruna `new UserRepository(dbConnection)` yazmalı olsaq, `UserService`-i də dəyişməliyik!
2. **Test Etmək Çətindir (Hard to Test):** `UserService`-i test edəndə saxta (Mock) databaza vermək olmur, çünki daxildə şərt kimi `new UserRepository()` yazılıb.
3. **Məsuliyyət Pozuntusu (SRP):** `UserService` həm istifadəçi məntiqini icra edir, həm də obyektləri yaratmaqla məşğul olur.

---

## 🟢 3. DI İlə Yazılan Kod (Loose Coupling - Gevşək Bağlılıq)

İndi isə eyni kodu **Dependency Injection** prinsipinə uyğun yazaq:

```typescript
// ✅ ƏLA YANAŞMA: DI İLƏ YAZILAN KOD
class UserRepository {
  getUser() {
    return { id: 1, name: 'Ali' };
  }
}

class CacheService {
  getCache(key: string) {
    return null;
  }
}

class UserService {
  // ✅ ƏLA: UserService asılılıqları çöldən (konstruktordan) qəbul edir!
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cacheService: CacheService,
  ) {}

  findUser() {
    const cached = this.cacheService.getCache('user_1');
    if (cached) return cached;
    return this.userRepo.getUser();
  }
}
```

### 🌟 DI-in bizə qazandırdıqları:
* **Gevşək Bağlılıq (Loose Coupling):** `UserService` asılılıqların necə yaradıldığını bilmir, sadəcə ona verilən hazır servisləri işlədir.
* **Asan Test:** Test zamanı konstruktora rahatlıqla saxta `MockUserRepository` verə bilərik: 
  `new UserService(new MockUserRepository(), new MockCacheService())`.

---

## ⚙️ 4. NestJS DI Container Arxitekturası və Daxili İş prinsipi

NestJS proqramı başladıda arxa fonda böyük bir **DI Container (Inversion of Control Container)** işə düşür. Bu konteyner 5 addımda bütün servisləri hazırlayır:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Module Scanner (Bütün @Module-ləri tapır)            │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Provider Store (Bütün @Injectable-ləri siyahılayır)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Dependency Graph (Hansı servis nəyə möhtacdır?)      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Instance Loader (Düzgün sırayla 'new' edir)          │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Instance Cache (Singleton: Yaddaşda 1 dəfə saxlayır) │
└─────────────────────────────────────────────────────────┘
```

### Addım-Addım Həlli:

1. **Step 1 (`@Injectable()`):** Servisin başlığına `@Injectable()` bəzədicisi qoyuruq. Bu NestJS-ə deyir ki: *"Bu klası DI konteyner idarə edə bilər!"*
2. **Step 2 (`@Module()`):** Modulda provayder kimi qeyd edirik: `providers: [UserService, UserRepository]`.
3. **Step 3 (Reflection & Metadata):** TypeScript arxada `Reflect.getMetadata('design:paramtypes', UserService)` vasitəsilə `UserService`-in konstruktorunda `UserRepository` olduğunu müəyyən edir.
4. **Step 4 (Recursive Resolution):** NestJS əvvəlcə `UserRepository`-ni `new` edir, sonra həmin instansiyanı `UserService`-in konstruktoruna inject edir!

---

## 💻 5. NestJS DI Container Səhnə Arxasında Nə Baş Verir? (Öz DI Container-imizi Yazırıq!)

Gəl NestJS-in daxilində çalışan məntiqi başa düşmək üçün **tam işlək, sadələşdirilmiş xüsusi DI Container koda** baxaq:

```typescript
import 'reflect-metadata';

// 1. Provayderlərimiz
class UserRepository {
  findUser() {
    return 'İstifadəçi tapıldı!';
  }
}

class UserService {
  // Konstruktora UserRepository lazım olduğunu bildiririk
  constructor(public userRepo: UserRepository) {}
}

// 2. NestJS-in daxili Container klasının sadə forması
class SimpleDIContainer {
  private providers = new Map<any, any>();
  private instances = new Map<any, any>();

  // Provayderi qeydiyyata alırıq
  register(token: any, providerClass: any) {
    this.providers.set(token, providerClass);
  }

  // Asılılıqları tapıb obyekti yaradırıq (Resolve)
  resolve<T>(token: any): T {
    // A) Əgər artıq yaratmışıqsa (Singleton), yaddaşdan qaytarırıq
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const ProviderClass = this.providers.get(token);
    if (!ProviderClass) {
      throw new Error(`Provayder tapılmadı: ${token.name}`);
    }

    // B) Reflect API vasitəsilə konstruktor parametrlərinin tiplərini alırıq
    const dependencies = Reflect.getMetadata('design:paramtypes', ProviderClass) || [];

    // C) Rekursiv olaraq hər bir asılılığı həll (resolve) edirik
    const resolvedDeps = dependencies.map((dep: any) => this.resolve(dep));

    // D) Obyekti həll olunmuş asılılıqlarla yaradırıq (new Provider(...deps))
    const instance = new ProviderClass(...resolvedDeps);

    // E) Keşə yazırıq (Singleton Scope)
    this.instances.set(token, instance);

    return instance;
  }
}

// 🚀 İSTİFADƏ EDƏK:
const container = new SimpleDIContainer();

// Servisləri konteynerə qeyd edirik
container.register(UserRepository, UserRepository);
container.register(UserService, UserService);

// Konteynerdən UserService-i istəyirik
const userService = container.resolve<UserService>(UserService);
console.log(userService.userRepo.findUser()); // Output: "İstifadəçi tapıldı!"
```

---

## 🛠️ 6. Provider Növləri (Provider Types)

NestJS-də servisləri (provayderləri) modulda müxtəlif yollarla qeydiyyatdan keçirə bilərik.

---

### 1️⃣ Standard Provider (`useClass`)

Ən çox istifadə etdiyimiz formadır. İki cür yazılır:

#### A) Implicit (Qısa forması):
```typescript
@Module({
  providers: [UserService], // Qısa yazılış
})
export class AppModule {}
```

#### B) Explicit (Açıq forması):
```typescript
@Module({
  providers: [
    {
      provide: UserService,  // DI Token (Açar)
      useClass: UserService, // İstifadə ediləcək Klas
    },
  ],
})
export class AppModule {}
```

---

### 2️⃣ Value Provider (`useValue`)

Bəzən klas yerinə **statik obyekt, konfiqurasiya və ya API açarı** inject etmək istəyirik:

```typescript
// AppModule
@Module({
  providers: [
    {
      provide: 'API_KEY', // String Token
      useValue: 'SECRET_API_KEY_12345',
    },
    {
      provide: 'DATABASE_CONFIG',
      useValue: {
        host: 'localhost',
        port: 5432,
      },
    },
  ],
})
export class AppModule {}

// Usage (İstifadə edildiyi servis):
@Injectable()
export class PaymentService {
  constructor(
    @Inject('API_KEY') private readonly apiKey: string,
    @Inject('DATABASE_CONFIG') private readonly dbConfig: any,
  ) {
    console.log('API Key:', this.apiKey); // SECRET_API_KEY_12345
  }
}
```

---

### 3️⃣ Class Provider (`useClass` Dinamik Əvəzetmə)

`useClass` bizə mühitdən (Production və ya Development) asılı olaraq servisləri dinamik dəyişməyə imkan verir:

```typescript
// 1. Mühitə uyğun Logger seçimi
@Module({
  providers: [
    {
      provide: LoggerService,
      useClass: process.env.NODE_ENV === 'production'
        ? ProductionLogger
        : DevelopmentLogger,
    },
  ],
})
export class AppModule {}
```

#### İnterfeys Əsaslı Enjeksiyon (Interface-based Injection):
TypeScript-də interfeyslər (Interface) run-time (icra vaxtı) silindiyi üçün Token kimi `string` istifadə olunur:

```typescript
export interface PaymentGateway {
  charge(amount: number): Promise<void>;
}

@Module({
  providers: [
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: StripePaymentService, // Gələcəkdə bunu rahatlıqla PayPalService ilə dəyişə bilərik!
    },
  ],
})
export class AppModule {}

// Servis daxilində istifadəsi:
@Injectable()
export class OrderService {
  constructor(
    @Inject('PAYMENT_GATEWAY') private readonly paymentGateway: PaymentGateway,
  ) {}

  async checkout(amount: number) {
    await this.paymentGateway.charge(amount);
  }
}
```

---

## 🎯 Yekun Xülasə (Özət)

1. **DI (Dependency Injection):** Klassın öz daxilində `new` etməsini qadağan edir, asılılıqları çöldən (konstruktordan) verir.
2. **Niyə Vacibdir?:** Kodu test edilə bilən (Testable), oxunaqlı və gevşək bağlı (Loosely Coupled) edir.
3. **NestJS-də Rolu:** NestJS tamamilə bu mexanizm üzərində qurulub. Bütün servislər `@Injectable()` ilə bəzədilir və `@Module()` daxilində `providers: [...]` massivinə əlavə edilir.
4. **Provider Növləri:** Klaslar üçün `useClass`, konfiqurasiya/obyektlər üçün `useValue`, dinamik/mütərəqqi həllər üçün Token-lər (`@Inject('TOKEN')`) istifadə olunur.
