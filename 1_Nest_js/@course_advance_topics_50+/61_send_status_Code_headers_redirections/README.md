# 🔄 🚦 📡 NestJS Status Codes, Custom Headers & Redirections (#61)

Salam! **`61_send_status_Code_headers_redirections`** dərsinə xoş gəldin!

NestJS-də Controller metodları standart olaraq uğurlu sorğular üçün avtomatik cavab qaytarır (GET üçün **200 OK**, POST üçün **201 Created**). Lakin real layihələrdə biz tez-tez:
1. Xüsusi HTTP Status Kodları daxil etməli (**202 Accepted**, **204 No Content**),
2. Klient brauzerinə və ya tətbiqinə xüsusi HTTP Header-lər göndərməli (**Cache-Control**, **X-Api-Version**),
3. Və ya istifadəçini dinamik/statik başqa URL-ə yönləndirməli oluruq (**Redirection**).

Bu sənəddə hər 3 mövzunun **bütün aspektlərini və best-practice yanaşmalarını** tam əhatə edirik.

---

## 🚥 1. HTTP Status Kodlarının Təyin Edilməsi (`@HttpCode`)

### 💡 Standart NestJS Davranışı:
* **`GET`**, **`PUT`**, **`PATCH`**, **`DELETE`** ➡️ `200 OK`
* **`POST`** ➡️ `201 Created`

### ⚙️ `@HttpCode()` Dekoratorunun İstifadəsi:
Status kodunu dəyişmək üçün `@HttpCode()` dekoratorundan və ya `@nestjs/common`-dan gələn **`HttpStatus`** enum-ından istifadə edirik:

```typescript
import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  
  // 🟢 202 Accepted: Sorğu qəbul edildi, amma fonda icra olunur (Async Processing)
  @Post('async-process')
  @HttpCode(HttpStatus.ACCEPTED) // 202
  processAsync() {
    return { status: 'Processing started' };
  }

  // 🟡 204 No Content: Əməliyyat uğurla icra olundu, amma klientə cavab gövdəsi (body) qaytarılmır
  @Post('clear-cache')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  clearCache() {
    // ⚠️ 204 olduqda return edilən dəyər klientə çatmayacaq
    return;
  }
}
```

---

## 📑 2. Custom HTTP Headers Göndərilməsi (`@Header`)

HTTP Başlıqları (Headers) klient ilə server arasında meta-məlumat mübadiləsi üçün istifadə olunur (məsələn: keşləmə qaydaları, versiya məlumatı, təhlükəsizlik başlığı).

### 🛠️ Statik Headers (`@Header`):

```typescript
import { Controller, Get, Header } from '@nestjs/common';

@Controller('reports')
export class ReportsController {

  @Get('monthly')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('X-Report-Generator', 'NestJS Analytics Engine')
  getMonthlyReport() {
    return { data: [100, 200, 300] };
  }
}
```

---

## 🔀 3. HTTP Redirection (Yönləndirmə - `@Redirect`)

Bəzən istifadəçini bir URL-dən başqa URL-ə avtomatik yönləndirmək lazım gəlir (məs: köhnəlmiş API endpoint-indən yenisinə, və ya OAuth girişindən sonra dashboard-a).

### 📍 3.1 Statik Yönləndirmə:
`@Redirect(url, statusCode)` dekoratorunda URL və Status Kod təyin edilir (Susmaya görə status **302 Found / Temporary Redirect** olur).

```typescript
import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  // İstifadəçi /auth/old-login-ə gələndə avtomatik /auth/login-ə yönləndirilir
  @Get('old-login')
  @Redirect('/auth/login', 301) // 301 Moved Permanently
  oldLogin() {}
}
```

### 🔀 3.2 Dinamik Yönləndirmə:
Sorğunun parametrlərindən (Query, User Role və s.) asılı olaraq başqa URL-ə yönləndirmək üçün Controller metodundan `{ url: string, statusCode?: number }` obyektini `return` edirik:

```typescript
import { Controller, Get, Redirect, Query } from '@nestjs/common';

@Controller('navigate')
export class NavigateController {

  @Get()
  @Redirect('https://docs.nestjs.com', 302) // Fallback (standart) URL
  handleDynamicRedirect(@Query('role') role: string) {
    if (role === 'admin') {
      return { url: '/admin/dashboard', statusCode: 302 };
    }
    if (role === 'user') {
      return { url: '/user/profile', statusCode: 302 };
    }
    // Əgər obyekt qaytarmasaq, @Redirect-də göstərilən fallback URL işləyəcək!
  }
}
```

---

## ⚡ 4. Dinamik Response & Headers: `@Res({ passthrough: true })`

### ⚠️ NestJS-də Ən Çox Edilən Səhv:
Əgər kimsə Controller metodunda `@Res() res: Response` yazsa, NestJS **Native Express Mode**-a keçir. Bu zaman standart `return { ... }` işləmir və cavabı mütləq `res.send()` və ya `res.json()` ilə verməli olursan.

### ✅ Peşəkar Həll: `passthrough: true`
Əgər dinamik olaraq header təyin etmək, kuki (cookie) yazmaq və eyni zamanda NestJS-in rahat `return` mexanizmini saxlayamq istəyirsənsə, `{ passthrough: true }` istifadə etməlisən:

```typescript
import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('download')
export class DownloadController {

  @Get('file')
  getFile(@Res({ passthrough: true }) res: Response) {
    // 1️⃣ Dinamik Header təyin edirik:
    res.header('Content-Type', 'application/json');
    res.header('X-Download-Timestamp', Date.now().toString());

    // 2️⃣ Dinamik Status Kod təyin edirik:
    res.status(HttpStatus.OK);

    // 3️⃣ NestJS tərəfindən cavab normal return olunur!
    return {
      fileName: 'report.pdf',
      status: 'ready',
    };
  }
}
```

---

## 📊 Xülasə Qaydaları (Cheat-Sheet)

| Əməliyyat | Yanaşma / Dekorator | Nümunə / Qeyd |
| :--- | :--- | :--- |
| **Status Kodunu Dəyişmək** | `@HttpCode(HttpStatus.ACCEPTED)` | POST üçün 201 yerinə 202 və ya 200 qaytarmaq üçün. |
| **Statik Header Əlavə Etmək** | `@Header('Cache-Control', 'none')` | Sabit HTTP başlıqları üçün. |
| **Statik Yönləndirmə** | `@Redirect('https://site.com', 301)` | Sabit keçidlər üçün. |
| **Dinamik Yönləndirmə** | Metoddan `{ url, statusCode }` return etmək | Sorğu parametrinə əsasən başqa URL-ə göndərmək. |
| **Dinamik Header/Kuki + Return** | `@Res({ passthrough: true })` | Native `res` obyektindən istifadə edib NestJS lifecycle-ını pozmamaq üçün. |
