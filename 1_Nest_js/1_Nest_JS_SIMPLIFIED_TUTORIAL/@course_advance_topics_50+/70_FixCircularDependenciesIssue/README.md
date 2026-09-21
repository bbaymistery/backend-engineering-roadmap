# 🔄 ⚡ Fix Circular Dependencies in NestJS (`forwardRef`) (#70)

Salam! **`70_FixCircularDependenciesIssue`** dərsinə xoş gəldin!

İstənilən böyüyən NestJS layihəsində proqramçıların qarşılaşdığı **ən çaşdırıcı xətalardan biri** Dairəvi Asılılıq (Circular Dependency) xətasıdır.

Bu sənəddə Dairəvi Asılılığın **nə olduğunu, niyə baş verdiyini, `forwardRef()` ilə necə tam həll edildiyini və kod arxitekturasını necə təmizləmək lazım olduğunu** ən sadə dildə öyrənirik.

---

## ❓ 1. Dairəvi Asılılıq (Circular Dependency) Nədir?

Dairəvi Asılılıq — İki və ya daha çox modulun/servisin **bir-birindən qarşılıqlı (zəncirvari) asılı olmasıdır**.

### 🔄 Vizual Nümayiş:

```
┌─────────────────┐                    ┌─────────────────┐
│  UsersService   │ ── (İstəyir) ───> │   AuthService   │
└─────────────────┘                    └─────────────────┘
        ▲                                       │
        │                                       │
        └───────────── (İstəyir) ───────────────┘
```

1. NestJS `UsersService`-i yaratmaq istəyir ➡️ Deyir ki: *"Mənə `AuthService` lazımdır!"*
2. NestJS `AuthService`-i yaratmaq üçün gedir ➡️ Deyir ki: *"Mənə `UsersService` lazımdır!"*
3. **NƏTİCƏ:** NestJS hansını birinci yaradacağını bilmir və dövrəyə düşüb serveri çökdürür!

### 💥 Alınan Xəta Mesajı:
```text
Nest cannot resolve dependencies of the UsersService (?, AuthService).
Please make sure that the argument UsersService at index [0] is available in the UsersModule context.
Circular dependency detected!
```

---

## 🛠️ 2. `forwardRef()` İlə Həll Yolu

`forwardRef()` (Forward Reference) — NestJS-ə deyir ki: **"Bu klassın/modulun tam yüklənməsini gözlə, tələsmə, reference-i (istinadı) bir az sonra (gecikdirilmiş) həll edərsən!"**

Dairəvi asılılığı tam həll etmək üçün **HƏM MODUL, HƏM DƏ SERVİS** səviyyəsində `forwardRef()` yazılmalıdır:

---

### 📍 2.1 Modul Səviyyəsində (`forwardRef`):

`AuthModule` və `UsersModule` bir-birini import edərkən `forwardRef()` istifadə edir:

```typescript
// users.module.ts
@Module({
  imports: [forwardRef(() => AuthModule)], // 👈 Modul səviyyəsində
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// auth.module.ts
@Module({
  imports: [forwardRef(() => UsersModule)], // 👈 Modul səviyyəsində
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

---

### 📍 2.2 Servis (Provider) Səviyyəsində (`@Inject(forwardRef(...))`):

Servislərin konstruktorunda `@Inject(forwardRef(() => ...))` istifadə edilir:

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService)) // 👈 Provider səviyyəsində
    private readonly authService: AuthService,
  ) {}
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) // 👈 Provider səviyyəsində
    private readonly usersService: UsersService,
  ) {}
}
```

---

## 🏗️ 3. Arxitektural Baxımdan Daha Yaxşı Həll Yolları

`forwardRef()` xətanı anında aradan qaldırır. Lakin bir layihədə həddən artıq `forwardRef()` yazmaq **arxitekturanın səhv qurulduğuna** işarədir.

Dairəvi asılılıqdan tam azad olmaq üçün 2 böyük arxitektural həll var:

### 💡 1-ci Həll: Ümumi Servis Yaradılması (Shared Module / Service)
Qarşılıqlı istifadə olunan kodu üçüncü bir neytral modula çıxarmaq:
`UsersService` və `AuthService` bir-birinə müraciət etmir, ikisi də ortaq `SharedUserAuthService`-ə müraciət edir (Tək tərəfli asılılıq).

### 💡 2-ci Həll: Event-Driven Architecture (Hadisə Əsaslı İdarəetmə)
Servislərin bir-birini birbaşa çağırması əvəzinə Event (Hadisə) emit etməsi (`@nestjs/event-emitter`):
Məsələn, `UsersService` yeni istifadəçi yaradanda event yayır: `this.eventEmitter.emit('user.created', user)`. `AuthService` isə həmin hadisəni dinləyir `@OnEvent('user.created')`. Bu zaman servislər bir-birini tanımır!

---

## 📊 Xülasə Qaydaları (Cheat-Sheet)

| Problem / Sual | Həll Yolu |
| :--- | :--- |
| **Xəta nədir?** | İki servis və ya modulun bir-birini zəncirvari istəməsidir. |
| **Tez Həll (Quick Fix)** | Həm `imports: [forwardRef(() => Module)]`, həm də `@Inject(forwardRef(() => Service))` yazmaq. |
| **Peşəkar Arxitektura Həlli** | Ortaq kodu `SharedModule`-ə çıxarmaq və ya Event-Driven (`EventEmitter`) istifadə etmək. |
