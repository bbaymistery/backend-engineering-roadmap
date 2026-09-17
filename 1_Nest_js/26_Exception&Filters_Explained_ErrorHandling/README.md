# 🚨 NestJS Exceptions & Exception Filters Explained | Error Handling (#26)

Salam! NestJS öyrənmə yolunda irəliləyən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`26_Exception&Filters_Explained_ErrorHandling`** mövzusunu — NestJS-də xətaların atılması (**Exception**) və həmin xətaların tutulub nizamlı JSON cavabına salınması (**Exception Filter**) anlayışlarını **ayrı-ayrı, aydın fərqləri**, canlı analogiyalar və TypeScript kodları ilə sıfırdan öyrənəcəksən.

---

## ❓ 1. Exception (Xəta) nədir və Exception Filter (Xəta Tutucu) nədir? (Əsas Fərq!)

Bir çox tərtibatçı bu iki anlayışı bir-biri ilə qarışdırır. Gəl onları ayrı-ayrı müəyyən edək:

### 1️⃣ Exception (Xəta Obyekti) — Xətanı ATMAQ:
* **Nədir?:** Proqramın icrası zamanı ortaya çıxan müstəsna problem halıdır (Məsələn: istifadəçi tapılmadı, parol yanlışdır, baza çökmüşdür).
* **Məqsədi:** Xətanı **yaratmaq və atmaqdır (throw etməkdir)**.
* **Nümunə:** 
  ```typescript
  throw new NotFoundException('İstifadəçi tapılmadı!');
  ```

---

### 2️⃣ Exception Filter (Xəta Tutucu) — Xətanı TUTMAQ və FORMATLAMAQ:
* **Nədir?:** NestJS-də atılan bütün xətaları **arxa fonda tutub (catch edib) müştəriyə (Frontend / Postman) veriləcək JSON cavabını şəkilləndirən** xüsusi təbəqədir.
* **Məqsədi:** Unhandled (tutulmamış) xətaların proqramı çökdürməsinin qarşısını almaq və brauzerə gözəl, nizamlı JSON cavabı qaytarmaqdır.
* **Nümunə JSON Cavabı:**
  ```json
  {
    "statusCode": 404,
    "timestamp": "2026-09-17T11:50:00.000Z",
    "path": "/users/999",
    "message": "İstifadəçi tapılmadı!"
  }
  ```

---

### 💡 Real Həyat Analogiyası (Təcili Yardım):
* **Exception (Xəta):** Xəstənin bədənində baş verən anidən nasazlıqdır (Məsələn: Qızdırma yüksəldi).
* **Exception Filter:** Təcili yardım həkiminin həmin nasazlığı qarşılayıb ona uyğun tibbi resept və nizamlı analiz hesabatı hazırlamasıdır.

---

## 📋 2. NestJS-də Hazır HTTP Exception Klasları Siyahısı

NestJS-də tez-tez istifadə etdiyimiz hazır xəta klasları (Built-in HTTP Exceptions):

| Exception Klasının Adı | HTTP Status Kodu | Nə Vaxt İstifadə Olunur? |
| :--- | :--- | :--- |
| **`BadRequestException`** | `400 Bad Request` | Gələn DTO məlumatları səhv və ya çatışmaz olduqda. |
| **`UnauthorizedException`** | `401 Unauthorized` | İstifadəçi daxil olmayıb və ya Token səhvdir. |
| **`ForbiddenException`** | `403 Forbidden` | İstifadəçinin rolunun bu API-yə icazəsi çatmadıqda. |
| **`NotFoundException`** | `404 Not Found` | Axtarılan data (istifadəçi, mehsul və s.) tapılmadıqda. |
| **`ConflictException`** | `409 Conflict` | Qeydiyyatda E-poçt və ya istifadəçi adı artıq mövcud olduqda. |
| **`InternalServerErrorException`** | `500 Internal Error` | Server daxilində gözlənilməz texniki xəta baş verdikdə. |

---

## 💻 3. Canlı Kodlar və Addım-Addım İzahı

Sən üçün yaradılmış 3 kod faylına nəzər salaq:

---

### 1️⃣ `exceptions.example.ts` — Servisdə Xətaların Atılması (Exception)

Servis daxilində şərtlər ödənmədikdə müvafiq NestJS xətalarını `throw new` ilə atırıq:

```typescript
// 📄 exceptions.example.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [{ id: 1, name: 'Ali', email: 'ali@example.com' }];

  // 1. NotFoundException (404)
  getUserById(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      // 🚨 404 Xətası atılır
      throw new NotFoundException(`ID-si ${id} olan istifadəçi tapılmadı!`);
    }
    return user;
  }

  // 2. ConflictException (409)
  createUser(email: string, name: string) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) {
      // 🚨 409 Xətası atılır
      throw new ConflictException(`"${email}" e-poçtu artıq istifadə olunur!`);
    }
    return { id: Date.now(), name, email };
  }
}
```

---

### 2️⃣ `http-exception.filter.ts` — Custom Exception Filter (Xətanı Tutmaq)

Atılan `HttpException` xətalarını tutub nizamlı JSON formatına salan xüsusi Filter:

```typescript
// 📄 http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 👈 Sırf HttpException xətalarını tutur
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Müştəriyə (Frontend-ə) standart, nizami JSON cavabı hazırlayırıq:
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    });
  }
}
```

---

### 3️⃣ `all-exceptions.filter.ts` — Gözlənilməz 500 Xətalarını Tutacaq Qlobal Filter

Proqramlaşdırma zamanı gözlənilməz runtime xətaları (məsələn: Databaza kəsildi və ya `null` pointer) baş verərsə, bu filter həmin xətanı tutub proqramın çökməsinin qarşısını alır:

```typescript
// 📄 all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch() // 👈 Mötərizə boşdur: BÜTÜN xətaları tutur!
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: status === 500 ? 'Sistemdə daxili gözlənilməz xəta baş verdi!' : (exception as any).message,
    });
  }
}
```

---

## 🎯 4. Exception Filter-in 3 Müxtəlif Səviyyədə Tətbiqi

Yaratdığımız `HttpExceptionFilter`-i 3 yolla aktiv edə bilərik:

1. **Route Səviyyəsində:**
   ```typescript
   @Get(':id')
   @UseFilters(HttpExceptionFilter)
   getUser(@Param('id') id: string) {}
   ```

2. **Controller Səviyyəsində:**
   ```typescript
   @UseFilters(HttpExceptionFilter)
   @Controller('users')
   export class UserController {}
   ```

3. **Global (Bütün Layihə) Səviyyəsində (`main.ts`):**
   ```typescript
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.useGlobalFilters(new AllExceptionsFilter()); // 👈 Bütün proyekt üçün aktiv olunur!
     await app.listen(3000);
   }
   bootstrap();
   ```

---

## 🎯 5. Yekun Xülasə (Qızıl Qaydalar)

1. **Exception (Xəta):** Xətanı **yaratmaq və atmaqdır** (`throw new NotFoundException()`).
2. **Exception Filter:** Xətanı **tutmaq və nizamlı JSON cavabına salmaqdır** (`@Catch(HttpException)`).
3. **Qlobal Filter (`app.useGlobalFilters`):** Bütün tətbiqdə baş verəcək xətaları vahid formatda birləşdirmək üçün ən yaxşı təcrübədir (Best Practice).
