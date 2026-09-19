# 🎓 NestJS Öyrənmə və Quruluş Bələdçisi (`src/`)

Bu bələdçi NestJS freymvorkunu yeni öyrənənlər üçün layihənin strukturu, qovluqların təyinatı və data axını (Data Flow) haqqında ətraflı məlumat verir.

---

## 📂 Proyekt Strukturu və Qovluqların Təyinatı

```text
src/
├── app/         ---> 🏢 Ana Modul (AppModule, AppController, AppService)
├── user/        ---> 👤 İstifadəçi modul (Controller, Service, DTO)
├── auth/        ---> 🔐 Giriş / Autentifikasiya məntiqi (Login)
├── database/    ---> 🗄️ Verilənlər Bazası servisi (Mock In-Memory DB)
├── core/        ---> ⚙️ Qlobal Guards, Interceptors, Filters
├── shared/      ---> 🤝 Bütün modulların paylaşdığı servislər (məs: Logger)
├── lib/         ---> 📦 Xarici kitabxanalar/servislər (məs: Email Service)
├── utility/     ---> 🛠️ Müstəqil köməkçi funksiyalar (məs: Date/String format)
└── main.ts      ---> 🚀 Proqramın giriş nöqtəsi (Bootstrap)
```

---

## 🛠️ Qovluqların Ətraflı İzahı

### 1. 🏢 `src/app/` (Kök Modul)
* **Təyinatı**: Proqramın əsas mərkəzidir. Bütün digər modullar (`UserModule`, `AuthModule`, `DatabaseModule` və s.) buradakı `app.module.ts` faylına bağlanır.
* **Fayllar**:
  - `app.module.ts`: Bütün modulları özündə birləşdirir.
  - `app.controller.ts`: Ana səhifə HTTP sorğusunu qarşılayır (`GET /`).
  - `app.service.ts`: Ana səhifə üçün mesaj qaytarır.
  - `README.md`: Ətraflı izah.

---

### 2. 🗄️ `src/database/` (Verilənlər Bazası)
* **Təyinatı**: Baza əməliyyatlarını idarə etmək üçün. Öyrənmə məqsədilə daxilində daxili massivlə (In-Memory Database) çalışan sadə istifadəçi siyahısı saxlanılır.
* **Fayllar**:
  - `database.service.ts`: `getUsers()`, `getUserById(id)`, `addUser(name, email)` funksiyalarını təmin edir.
  - `database.module.ts`: Bazanı digər modullara təqdim edir.

---

### 3. 👤 `src/user/` (İstifadəçi Funksionallığı - CRUD)
* **Təyinatı**: İstifadəçilərlə bağlı HTTP sorğuları və biznes məntiqi.
* **Data Axını (Data Flow)**:
  `UserController` (HTTP API) ➡️ `UserService` (Biznes məntiqi) ➡️ `DatabaseService` (Baza)
* **Endpoint-lər**:
  - `GET /users` — Bütün istifadəçiləri gətirir.
  - `GET /users/1` — ID-si 1 olan istifadəçini gətirir.
  - `POST /users` — Yeni istifadəçi yaradır (Body: `{ "name": "Vəli", "email": "veli@example.com" }`).
* **Fayllar**:
  - `user.controller.ts`
  - `user.service.ts`
  - `dto/create-user.dto.ts`

---

### 4. 🔐 `src/auth/` (Giriş / Autentifikasiya)
* **Təyinatı**: Sistemə daxil olmaq (Login) və şəxsiyyəti təsdiqləmək üçün.
* **Endpoint-lər**:
  - `POST /auth/login` (Body: `{ "email": "ali@example.com" }`) — İstifadəçini tapır və simvolik `accessToken` qaytarır.
* **Fayllar**:
  - `auth.controller.ts`
  - `auth.service.ts`
  - `auth.module.ts`

---

### 5. ⚙️ `src/core/` (Mərkəzi Təhlükəsizlik və İzləmə)
* **Təyinatı**: Tətbiqin təhlükəsizliyi (Guards) və sorğu vaxtını ölçmək (Interceptors).
* **Nümunə**:
  - `AuthGuard`: İstək gələndə API Key-i yoxlayır (`guards/auth.guard.ts`).
  - `LoggingInterceptor`: İstəyin neçə millisaniyəyə icra olunduğunu konsolda göstərir (`interceptors/logging.interceptor.ts`).

---

### 6. 🤝 `src/shared/` (Paylaşılan Servislər)
* **Təyinatı**: Layihənin istənilən modulunda istifadə oluna bilən ümumi servislər.
* **Nümunə**: `LoggerService` — Konsola standart formatda loq çıxarmaq üçün (`services/logger.service.ts`).

---

### 7. 📦 `src/lib/` (Xarici Kitabxanalar)
* **Təyinatı**: Xarici servislərlə (Email göndərmə, SMS, Ödəniş sistemləri) əlaqə quran servislər.
* **Nümunə**: `EmailService` — E-poçt göndərmək üçün (`email.service.ts`).

---

### 8. 🛠️ `src/utility/` (Sadə Köməkçi Funksiyalar)
* **Təyinatı**: NestJS-dən müstəqil saf TypeScript funksiyaları.
* **Nümunə**:
  - `formatDate(date)` — Tarixi `YYYY-MM-DD` formasına salır (`date.utility.ts`).
  - `capitalize(text)` — Mətnin baş hərfini böyüdür (`string.utility.ts`).

---

## 🌐 Server Portu və Test Etmək

Server **`http://localhost:3000`** ünvanında işləyir.

### Test etmək üçün:
1. Terminalda proqramı başladın: `npm run start:dev`
2. Brauzerdə və ya Postman-da yoxlayın:
   - **Ana Səhifə**: `GET http://localhost:3000/`
   - **Bütün İstifadəçilər**: `GET http://localhost:3000/users`
   - **Tək İstifadəçi**: `GET http://localhost:3000/users/1`
   - **Giriş Etmək**: `POST http://localhost:3000/auth/login` (Body: `{ "email": "ali@example.com" }`)
