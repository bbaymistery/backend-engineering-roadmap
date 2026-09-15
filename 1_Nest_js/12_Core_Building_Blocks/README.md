# 🧱 NestJS Building Blocks (Təməl İnşa Blokları)

Bu sənəddə NestJS freymvorkunun **bütün inşa blokları** (Modules, Controllers, Services/Providers, Middleware, Guards, Interceptors, Pipes, Filters), onların nə zaman istifadə olunduğu, kod nümunələri və bir-biri ilə necə inteqrasiya olunduğu ətraflı izah olunur.

---

## 🎯 Nə Öyrənəcəksiniz?

* 📦 **Bütün NestJS İnşa Blokları** və praktiki kod nümunələri.
* ❓ Hər bir komponenti **NƏ ZAMAN** və **NƏ ÜÇÜN** istifadə etməli.
* 🔄 Komponentlərin sorğu zəncirində (Request Lifecycle) **necə BİRLİKDƏ işlədiyi**.

---

## 🔄 NestJS Sorğu Zənciri (Request Lifecycle)

İstifadəçidən gələn HTTP sorğusu cavab olaraq geri dönənə qədər bu sırayla icra olunur:

```text
Sorğu (Request)
   │
   ▼
1. 🔀 Middleware          (Raw HTTP sorğusunu qarşılayır, loqlayır və ya parse edir)
   │
   ▼
2. 🛡️ Guards              (İstifadəçinin icazəsini və rolunu yoxlayır)
   │
   ▼
3. ⏱️ Interceptors (Pre)  (Sorğu icra olunmazdan əvvəl vaxtı ölçməyə başlayır)
   │
   ▼
4. 🧪 Pipes               (Daxil olan Body/Param datalarını təmizləyir və doğrulayır)
   │
   ▼
5. 🎮 Controller          (Endpoint routing və sorğunu qarşılama)
   │
   ▼
6. 💼 Service / Provider  (Biznes məntiqi, Baza və ya Keş sorğuları)
   │
   ▼
7. ⏱️ Interceptors (Post) (Cavab strukturunu bükür və ya formatlayır)
   │
   ▼
8. 🚨 Exception Filters   (Əgər xəta baş verərsə, xətanı tutub cavaba çevirir)
   │
   ▼
Cavab (Response)
```

---

## Topic 6.1: Modules (`@Module()`)

### 💡 Nədir?
Modul — tətbiqin müəyyən bir hissəsini (məsələn: User, Auth, Database) paketləyən və təşkil edən mərkəzi qovluqdur.

### 📝 Kod Nümunəsi:
```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';

// Basic Module
@Module({
  imports: [DatabaseModule],       // 🟢 Digər modulları daxil etmək üçündür
  controllers: [UserController],   // 🟢 Endpoint-ləri idarə edən kontrolerlər
  providers: [UserService],        // 🟢 Biznes məntiqini icra edən servislər
  exports: [UserService],          // 🟢 Digər modulların istifadəsi üçün eksport
})
export class UserModule {}
```

---

## Topic 6.2: Controllers (`@Controller()`)

### 💡 Nədir?
Kontroler — xaricdən gələn HTTP sorğularını (`GET`, `POST`, `PUT`, `DELETE`) qarşılayan və cavab qaytaran təbəqədir.

### 📝 Kod Nümunəsi:
```typescript
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
```

---

## Topic 6.3: Providers / Services (`@Injectable()`)

### 💡 Nədir?
Provider (Servis) — biznes məntiqini, verillənlər bazası sorğularını, keşləməni və xarici inteqrasiyaları həyata keçirən əsas işçi təbəqədir.

### 📝 Kod Nümunəsi (Keşləmə və Baza Sorğusu):
```typescript
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('CACHE') private readonly cache: CacheService,
  ) {}

  async findById(id: number): Promise<User> {
    // 1. Check cache (Keşdə varmı?)
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return cached;

    // 2. Query database (Bazadan axtar)
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    // 3. Store in cache (Keşə yaz: 3600 saniyəlik)
    await this.cache.set(`user:${id}`, user, 3600);
    return user;
  }
}
```

---

## Topic 6.4: Middleware (`NestMiddleware`)

### 💡 Nədir?
Middleware — sorğu Kontrolerə çatmazdan **ən öncə** (hətta Guards-dan da əvvəl) xam HTTP sorğusunu (req, res, next) qarşılayan koddur.

### 📝 Kod Nümunəsi:
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[HTTP Request] ${req.method} ${req.originalUrl}`);
    next(); // 🟢 Növbəti mərhələyə keçir
  }
}
```

---

## Topic 6.5: Guards (`CanActivate`)

### 💡 Nədir?
Guard — istifadəçinin sistemə girməyə və ya müəyyən bir əməliyyatı icra etməyə **icazəsinin (Authorization / Roles)** olub-olmadığını yoxlayır.

### 📝 Kod Nümunəsi:
```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token tapılmadı!');
    }
    return true; // 🟢 İcazə verildi
  }
}
```

---

## Topic 6.6: Interceptors (`NestInterceptor`)

### 💡 Nədir?
Interceptor — sorğu icra olunmazdan əvvəl və icra olunduqdan sonra araya girərək **vaxtı ölçmək (Logging)** və ya **cavab strukturunu dəyişmək** üçün istifadə olunur.

### 📝 Kod Nümunəsi:
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`İcra müddəti: ${Date.now() - now}ms`)),
    );
  }
}
```

---

## Topic 6.7: Pipes (`PipeTransform`)

### 💡 Nədir?
Pipe — daxil olan `Body`, `Param`, `Query` datalarını **təmizləmək (Sanitization)**, **çevirmək (Transformation)** və ya **doğrulamaq (Validation)** üçündür.

### 📝 Kod Nümunəsi:
```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('ID yalnız rəqəm olmalıdır!');
    }
    return val;
  }
}
```

---

## Topic 6.8: Exception Filters (`ExceptionFilter`)

### 💡 Nədir?
Filter — proqramın hər hansı bir yerində baş verən xətaları (Exceptions) tutub istifadəçiyə nizama salınmış standart JSON formatında xəta qaytarır.

### 📝 Kod Nümunəsi:
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

---

## 📊 Xülasə Cədvəli: Hansı Komponenti Ne Vaxt İstifadə Etməli?

| Komponent | Əsas Rolu | Nümunə İstifadə Yeri |
| :--- | :--- | :--- |
| **Module** | Kodu paketləyir və təşkil edir | `UserModule`, `AuthModule` |
| **Controller** | HTTP endpoint-ləri qarşılayır | `@Get('/users')`, `@Post('/users')` |
| **Provider / Service** | Biznes məntiqi və Baza sorğuları | `userService.findById(id)` |
| **Middleware** | Xam HTTP sorğusunu qarşılayır və parse edir | Request Logger, Body Parser |
| **Guard** | Təhlükəsizlik və icazə yoxlanışı | Auth Guard, Admin Roles Guard |
| **Interceptor** | Sorğu vaxtını ölçür və cavabı bükür | Timing Log, Response Format Mapper |
| **Pipe** | Datanı təmizləyir və doğrulayır | `ValidationPipe`, `ParseIntPipe` |
| **Filter** | Qlobal xətaları tutub nizama salır | Global Exception Filter |
