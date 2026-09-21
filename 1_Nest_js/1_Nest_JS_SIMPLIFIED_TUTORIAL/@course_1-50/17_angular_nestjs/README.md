# 🅰️ Angular-Inspired Design in NestJS — NestJS və Angular Arxitekturası (Hərtərəfli Tədris Təlimatı)

Salam! NestJS öyrənməyə davam edən dostum, xoş gəldin! 

Bu sənəddə **`17_angular_nestjs`** qovluğundakı mövzunu — **NestJS-in nə üçün və necə Angular freymvorkundan təsirləndiyini**, onların arasındakı ortaq konseptləri, oxşarlıq və fərqləri **heç bir şəkil istifadə etmədən**, aydın kodlar və müqayisəli cədvəllərlə öyrənəcəksən.

---

## ❓ Əvvəlcə Sənin Suallarını Cavablandıraq!

### 1️⃣ "NestJS Express kimi backend yazmağa kömək edən bir framework-dür?"

**BƏLİ, TAMAMİLƏ DOĞRUDUR!**
* **Express.js:** Çox sadə, minimalist və sərbəst bir Node.js karkasıdır. Çox kiçik proyektlər üçün əladır, lakin böyük layihələrdə hər kəs fərqli kod yazdığı üçün xaos yaranır.
* **NestJS:** Əslində daxildə **Express.js**-dən (və ya Fastify-dan) istifadə edir! NestJS Express-in üzərində çox nizamlı, strukturlaşdırılmış, modulyar və TypeScript əsaslı bir memarlıq təmin edir. Yəni NestJS — Express-in peşəkar, nizamlı və güclü formasıdır.

---

### 2️⃣ "Mən NestJS bilsəm, Angular-ı da bilmiş oluram?"

**BƏLİ VƏ XEYR! (Çox maraqlı və vacib məqam):**

* **Sintaksis və Arxitektura baxımından (BƏLİ):** 80-90% eynidir! NestJS-in yaradıcısı Kamil Myśliwiec NestJS-i düzəldərkən Angular-ın dizayn sistemindən ilhamlanıb. Əgər NestJS-də `@Module()`, `@Injectable()`, `Pipes`, `Guards`, `Interceptors` və `Dependency Injection` öyrənmisənsə, Angular-ın kodunu açanda **öz kodun kimi başa düşəcəksən**.
* **İstifadə Sahəsi baxımından (XEYR):** 
  * **NestJS — BACKEND (Server-side)** üçündür: Verilənlər bazası (SQL/NoSQL), API endpoint-ləri, Auth, Server təhlükəsizliyi.
  * **Angular — FRONTEND (Client-side)** üçündür: İstifadəçi interfeysi (UI), HTML şablonları, CSS düymələri, Brauzer hadisələri.

> 💡 **Qısası:** NestJS bilən biri Angular-ı **çox qısa müddətdə (bir neçə günə)** öyrənə bilər. Çünki məntiq və struktur tamamilə eynidir, sadəcə Angular-da HTML/CSS tərəfini öyrənmək qalır!

---

## 📊 1. Topic 7.1: Angular və NestJS Müqayisə Cədvəli (Shared Concepts)

Gəl iki freymvorkun anlaysışlarını qarşı-qarşıya qoyaq:

| Konsept | Angular (Frontend) | NestJS (Backend) | İzahı / Rolu |
| :--- | :--- | :--- | :--- |
| **Modules** | `@NgModule()` | `@Module()` | Kodu mütəşəkkil hissələrə bölür (UserModule, AuthModule). |
| **Components / Controllers**| `@Component()` | `@Controller()` | Gələn istəyi qəbul edən hissə (Angular-da UI, Nest-də HTTP Endpoint). |
| **Services** | `@Injectable()` | `@Injectable()` | Əsas biznes məntiqini icra edən klaslar. |
| **Dependency Injection** | Hierarchical DI | Container-based DI | Servisləri konstruktordan avtomatik inject edən sistem. |
| **Decorators** | Metadata decorators | Metadata decorators | `@Symbol()` vasitəsilə klaslara və metodlara metadata vermək. |
| **Pipes** | Transform data | Transform & Validate | Angular-da mətni uppercase edir, NestJS-də gələn DTO-nu yoxlayır/çevirir. |
| **Guards** | Route guards | Auth guards | Angular-da səhifəyə keçidi yoxlayır, NestJS-də API-yə icazəni yoxlayır. |
| **Interceptors** | HTTP interceptors | Request interceptors | Angular-da çıxan HTTP-yə Token qoyur, NestJS-də gələn Request-i izləyir. |

---

## 🏗️ 2. Topic 7.2: Module Müqayisəsi (`@NgModule` vs `@Module`)

Bax gör kodlar bir-birinə necə bənzəyir:

```typescript
// 🅰️ ANGULAR MODULE (Frontend)
@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [UserComponent, UserListComponent], // UI Komponentləri
  providers: [UserService],                         // Servislər
  exports: [UserComponent],
})
export class UserModule {}

// 🪺 NESTJS MODULE (Backend)
@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [UserController],                   // HTTP Controller-lər
  providers: [UserService],                        // Servislər
  exports: [UserService],
})
export class UserModule {}
```

---

## 🎮 3. Topic 7.3: Component vs Controller

* **Angular Component:** İstifdəçinin gördüyü ekranı (HTML) və onun daxili məntiqini idarə edir.
* **NestJS Controller:** HTTP daxil olan sorğuları (`GET /users`, `POST /users`) qarşılayır.

```typescript
// 🅰️ ANGULAR COMPONENT
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  users: any[] = [];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => this.users = data);
  }
}

// 🪺 NESTJS CONTROLLER
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
```

---

## 💉 4. Topic 7.4: Dependency Injection Oxşarlığı

Hər iki freymvorkda da **Constructor Injection** tamamilə eynidir:

```typescript
// 🅰️ Angular & 🪺 NestJS-də Konstruktor Enjeksiyonu
@Injectable()
export class UserService {
  constructor(
    private readonly http: HttpClient,          // Angular-da HTTP Client
    private readonly repository: UserRepository, // NestJS-də Database Repo
    @Inject('API_URL') private readonly apiUrl: string, // Hər ikisində Token Injection
    @Optional() private readonly logger?: LoggerService, // Hər ikisində Opsional Servis
  ) {}
}
```

---

## 🔄 5. Topic 7.5: Pipes Müqayisəsi (Data Transformasiyası)

* **Angular Pipe:** Ekran üçün mətni dəyişir (məsələn: `john` -> `John`).
* **NestJS Pipe:** Gələn parametr tiplərini çevirir və ya validation edir (məsələn: `"123"` stringini `123` number edir).

```typescript
// 🅰️ ANGULAR PIPE
@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
} // İstifadəsi HTML-də: {{ name | capitalize }}

// 🪺 NESTJS PIPE
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) throw new BadRequestException('Düzgün ədəd daxil edin!');
    return val;
  }
} // İstifadəsi Controller-də: @Param('id', ParseIntPipe) id: number
```

---

## 🛡️ 6. Topic 7.6: Guards Müqayisəsi (İcazə Yoxlanışı)

* **Angular Guard:** İstifadəçinin `/dashboard` səhifəsinə girməyə haqqı varmı? (Yoxdursa `/login`-ə yönəldir).
* **NestJS Guard:** İstəyi göndərən istifadəçinin `Bearer Token`-i varmı? (Yoxdursa `401 Unauthorized` verir).

```typescript
// 🅰️ ANGULAR GUARD
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}

// 🪺 NESTJS GUARD
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.auth.validateRequest(request);
  }
}
```

---

## ⚡ 7. Topic 7.7: Interceptors Müqayisəsi

* **Angular Interceptor:** Brauzerdən çıxan bütün HTTP sorğularına avtomatik `Authorization: Bearer Token` header-i əlavə edir.
* **NestJS Interceptor:** Serverə gələn sorğunun cavabını dəyişdirir (məsələn: bütün cavabları `{ data: ..., success: true }` formatına salır).

```typescript
// 🅰️ ANGULAR INTERCEPTOR
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer token_123'),
    });
    return next.handle(authReq);
  }
}

// 🪺 NESTJS INTERCEPTOR
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({ data, success: true }))
    );
  }
}
```

---

## 🎯 8. Topic 7.8: Niyə NestJS Angular Dizaynını Seçdi? (Benefits)

NestJS-in yaradıcıları nə üçün Angular-ın strukturunu seçdilər?

1. **Angular Təcrübəsi Olanlar Üçün Çox Asandır:** Frontend-də Angular yazan proqramçı 1 günə NestJS ilə backend yaza bilir.
2. **Sınaqdan Keçmiş Memarlıq (Proven Architecture):** Böyük, korporativ (enterprise) tətbiqlərdə intizamı qoruyur.
3. **Güclü Tipləmə (TypeScript-First):** Tip təhlükəsizliyi sayəsində xətaları daha kod yazarkən tutur.
4. **Modulyarlıq (Modularity):** Hər bir funksionallıq öz modulunda müstəqil yaşayır.
5. **Asan Test Edilə Bilmə (Testability):** DI sayəsində Mock servislər yaratmaq uşaq oyuncağıdır.
6. **Masiştablana Bilərlik (Scalability):** Proyekt nə qədər böyüsə də, kod xaosuna çevrilmir.

---

### 🎨 Design Philosophy (Dizayn Fəlsəfəsi)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Decorators      │ ───►  │ Metadata        │ ───►  │ Reflection API  │ ───►  │ DI Container    │
│ (@Module, etc.) │       │ Storage         │       │ (Reflect)       │       │ (Resolution)    │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 🎯 Yekun Özet (Xülasə)

1. NestJS — Express.js üzərində qurulmuş, peşəkar backend freymvorkudur.
2. Angular bildikdə NestJS, NestJS bildikdə Angular öyrənmək 1-2 günlük işdir, çünki bütün `@Module`, `@Injectable`, `Pipes`, `Guards`, `Interceptors` arxitekturası tamamilə eynidir!
3. Aralarındakı tək fərq: Angular brauzerdə UI (frontend) göstərir, NestJS isə serverdə API (backend) cavabları verir.
