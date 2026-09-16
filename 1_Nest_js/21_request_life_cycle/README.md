# 🔄 NestJS Request Lifecycle — Sorğunun Ömür Dövrü (Hərtərəfli Tədris Təlimatı)

Salam! NestJS öyrənməyə davam edən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`21_request_life_cycle`** qovluğundakı mövzunu — bir HTTP sorğusu (request) brauzerdən serverə daxil olduqda cavab geriyə qayıdanadək **hansı mərhələlərdən və hansı sırayla keçdiyini** (Middleware, Guard, Interceptor, Pipe, Controller, Service, Database, Filter) **çox aydın, oxunaqlı və şəffaf sxemlər**, canlı analogiyalar və kodlar ilə sıfırdan öyrənəcəksən.

---

## ✈️ 1. Real Həyat Analogiyası: Hava Limanında Təhlükəsizlik Zolağı

Təsəvvür et ki, **Sərnişinsən (Client / HTTP Request)** və təyyarəyə minib uçmaq istəyirsən:

1. **Hava Limanının Giriş Qapısı (`Middleware`):** Pasportunu və çantanı ilk dəfə yoxlayırlar, biletini skan edirlər.
2. **Pasport Kontrolu (`Guard`):** Vizanın və ya uçuş icazənin olub-olmadığını yoxlayırlar. İcazən yoxdursa, içəri buraxmırlar (`401/403 Error`).
3. **Nəzarətçi Operator (`Interceptor - Pre`):** İçəri girdiyin vaxtı (vaxt sayğacını) qeydə alırlar.
4. **Rentgen Skaneri (`Pipe`):** Çantanı skan edib içindəki qadağan olunmuş əşyaları təmizləyirlər və ya məlumatları düzgün formaya salırlar (Validation).
5. **Təyyarə Salonu (`Controller`):** Oturacağında əyləşirsən və stüardessaya sifariş verirsən.
6. **Təyyarə Mətbəxi (`Service`):** Stüardessa yeməyi hazırlamaq üçün anbardan/mətbəxdən erzaqları alır (**`Database`**).
7. **Çıxışda Hədiyyə Verilməsi (`Interceptor - Post`):** Eniş etdikdən sonra sənə hədiyyə paketi təqdim edirlər (Cavab verilmədən öncə datanı bəzəmək).
8. **Təcili Yardım Brifinqi (`Exception Filter`):** Əgər yolda hər hansı təhlükə baş verərsə, xüsusi xilasetmə komandası dərhal işə düşür və təhlükəsizliyi təmin edir.

---

## 🗺️ 2. Sorğunun Tam İcra Sırası (Aydın və İri Şriftli Sxem)

Sorğu müştəridən daxil olub müştəriyə qayıdanadək aşağıdakı dəqiq sıradan keçir:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. HTTP Request (POST /tasks)                                          │
│    Client (Postman/Brauzer) ──► NestJS Server                           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Middleware                                                           │
│    req/res tutulur, CORS & Logger işləyir, next() çağırılır             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Guard (Təhlükəsizlik Qapısı)                                        │
│    - İcazə Yoxdursa (false) ──► Exception Filter ──► 401 Unauthorized   │
│    - İcazə Varsa (true)    ──► Növbəti addıma keçir                     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Interceptors (Pre-logic)                                             │
│    Sorğudan əvvəl taymer açır (Start Timer)                             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. Pipes (Validation & Transformation)                                  │
│    Gələn DTO-nu yoxlayır və tipləri çevirir                             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 6. Controller Handler                                                   │
│    Routing edilir və Biznes Məntiqi üçün Service çağırılır              │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 7. Service & Database                                                   │
│    Query Database ──► Database-dən Məlumat Qayıdır ──► Service Məntiqi │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 8. Interceptors (Post-logic)                                            │
│    Controller-dən gələn cavabı nizamlı JSON-a salır, taymeri bitirir    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 9. Final HTTP Response (200 OK / 201 Created)                           │
│    Cavab Müştəriyə (Client) Çatır                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📌 3. Mərhələlərin Qısa Mətni və Detallı Axını

İstənilən bir API istəyi verildikdə baş verən 9 addım:

1. **Step 1 — Client İstəyi:** Müştəri `POST /tasks` istəyi atır.
2. **Step 2 — Middleware:** `LoggerMiddleware` istəyi tutur və qeydiyyata alır (`next()`).
3. **Step 3 — Guard:** `AuthGuard` istifadəçinin Token-ini yoxlayır (`canActivate`). Yoxdursa `401 Unauthorized` atılır.
4. **Step 4 — Interceptor (Pre):** `LoggingInterceptor` taymeri başladır (`Date.now()`).
5. **Step 5 — Pipe:** `ValidationPipe` gələn JSON-un DTO-ya uyğunluğunu yoxlayır (xəta varsa `400 Bad Request`).
6. **Step 6 — Controller:** `TaskController` istəyi qarşılayır və `taskService.createTask()` metodunu çağırır.
7. **Step 7 — Service & DB:** `TaskService` verilənlər bazasına (`Database`) yazır və cavabı qaytarır.
8. **Step 8 — Interceptor (Post):** `TransformInterceptor` cavabı `{ data: res, success: true }` formatına salır və taymeri dayandırır.
9. **Step 9 — Final Response:** Hazır JSON cavabı müştəriyə çatır.

---

## 🔬 4. 8 Mərhələnin Tək-Tək Hər Birinin Dərin İzahı və Kodu

---

### 1️⃣ Mərhələ 1: Middleware (İlk Qarşılaşma)
HTTP sorğusu serverə daxil olan kimi **ilk çalışan** təbəqədir. Sorğunun başlığını (headers) dəyişə, `console.log` ilə logging edə və ya `next()` çağıraraq növbəti addıma ötürə bilər.

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`📥 Sorğu gəldi: ${req.method} ${req.url}`);
    next(); // 👈 Növbəti addıma (Guard-a) keçid verir
  }
}
```

---

### 2️⃣ Mərhələ 2: Guard (Təhlükəsizlik Qapısı)
İstifadəçinin bu API-yə müraciət etməyə **hüququnun olub-olmadığını** yoxlayır. `true` qaytarsa sorğu davam edir, `false` qaytarsa dərhal `403 Forbidden` xətası verir.

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    return token === 'Bearer valid_token'; // true və ya false
  }
}
```

---

### 3️⃣ Mərhələ 3: Interceptor — Pre-Controller (Nəzarətçi)
Controller-dən **ƏVVƏL** işə düşən hissədir. Məsələn, sorğunun nə qədər vaxt apardığını ölçmək üçün taymeri burada başladırıq.

```typescript
@Injectable()
export class BenchmarkInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log('⏱️ Taymer başladı...');

    // next.handle() çağırılana qədər olan hissə PRE-controller sayılır
    return next.handle().pipe(
      // Bu hissə POST-controller sayılır (cavab qayıdanda işləyir)
      tap(() => console.log(`⏱️ Bitdi: ${Date.now() - now}ms`))
    );
  }
}
```

---

### 4️⃣ Mərhələ 4: Pipe (Transformasiya və Doğrulama)
Gələn `body`, `param` və ya `query` datalarını yoxlayır (Validation) və ya tiplərini çevirir. DTO-da xəta varsa, controller-ə çatmadan `400 Bad Request` atır.

```typescript
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Parametr mütləq ədəd olmalıdır!');
    }
    return val;
  }
}
```

---

### 5️⃣ Mərhələ 5: Controller & Service (Biznes Məntiqi)
Təmizlənmiş və yoxlanılmış data Controller-ə çatır. Controller məntiqi icra etmək üçün Service-i çağırır, Service isə məlumat bazası (Database) ilə işləyir.

```typescript
// Controller
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto); // Service-i çağırır
  }
}
```

---

### 6️⃣ Mərhələ 6: Interceptor — Post-Controller (Cavabı Şəkilləndirmək)
Controller işini bitirib məlumatı qaytardıqdan sonra Interceptor-un `pipe()` hissəsi işə düşür. Cavabı vahid formatda qablaşdırmaq üçün istifadə olunur:

```typescript
// Cavabı avtomatik bu formaya salır: { data: result, success: true }
return next.handle().pipe(
  map((data) => ({
    data,
    success: true,
    timestamp: new Date().toISOString(),
  }))
);
```

---

### 7️⃣ Mərhələ 7: Exception Filter (Xəta Tutucu)
Bütün bu proseslərin hər hansı bir yerində (Guard-da, Pipe-da, Service-də) xəta (`throw new Error()`) baş verərsə, sorğu dərhal Exception Filter-ə düşür və müştəriyə nizamlı JSON xətası qaytarır.

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

### 8️⃣ Mərhələ 8: Final Response (Cavabın Müştəriyə Çatması)
Formatlanmış nizamlı JSON məlumatı müştəriyə (`200 OK` və ya `201 Created`) status kodu ilə çatır.

---

## 📶 5. Qatların Daxili İcra Sıralaması (Global -> Controller -> Route)

Əgər eyni komponentdən (məsələn Guard-dan) həm Global, həm Controller, həm də Route səviyyəsində tətbiq etmişiksə, icra sırası belə olur:

```text
1. Global Middleware ──► 2. Controller Middleware ──► 3. Route Middleware
                           │
                           ▼
4. Global Guard      ──► 5. Controller Guard      ──► 6. Route Guard
                           │
                           ▼
7. Global Interceptor──► 8. Controller Interceptor──► 9. Route Interceptor
                           │
                           ▼
10. Global Pipe      ──► 11. Controller Pipe     ──► 12. Route Pipe ──► 13. Route Param Pipe
                           │
                           ▼
                     [ Controller Handler ]
```

---

## 🎯 Yekun Xülasə (Çek-List Cədvəli)

| Komponent | Harada Çalışır? | Əsas Rolu Nədir? | Cavab Xətası |
| :--- | :--- | :--- | :--- |
| **Middleware** | Ən Başda | Request/Response-u tutmaq, CORS, Body Parsing | - |
| **Guard** | Middleware-dən Sonra | Auth & Role icazəsini yoxlamaq | `401 / 403` |
| **Interceptor (Pre)**| Guard-dan Sonra | Taymer başlatmaq, log tutmaq | - |
| **Pipe** | Interceptor-dan Sonra| DTO Validation və tip çevirmək | `400 Bad Request` |
| **Controller/Service**| Mərkəzdə | Əsas biznes məntiqini və DB sorğularını icra etmək | `404 / 500` |
| **Interceptor (Post)**| Controller-dən Sonra| Cavab formatını standartlaşdırmaq | - |
| **Exception Filter** | Ən Sonda (Xəta Anında)| Baş verən bütün xətaları nizamlı JSON-a salmaq | İstənilən Error JSON |
