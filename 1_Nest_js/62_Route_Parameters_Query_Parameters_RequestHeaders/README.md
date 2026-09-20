# 🎯 📌 📥 NestJS Route Parameters, Query Parameters & Request Headers (#62)

Salam! **`62_Route_Parameters_Query_Parameters_RequestHeaders`** dərsinə xoş gəldin!

HTTP sorğusu serverə gələndə klient (Frontend/Mobil tətbiq) mühüm məlumatları 3 əsas yolla göndərir:
1. **Route Parameters (`@Param`)**: URL yolunun daxilində dynamic dəyişənlər kimi (məs: `/users/42`).
2. **Query Parameters (`@Query`)**: URL-in sonuna `?` işarəsi ilə qoşulan filter və süzgəclər kimi (məs: `/users?page=1&limit=10`).
3. **Request Headers (`@Headers`)**: HTTP sorğusunun başlıq hissəsində təhlükəsizlik və meta məlumatlar kimi (məs: `Authorization: Bearer token123`).

Bu sənəddə bu 3 məlumat mənbəyinin NestJS-də necə oxunduğunu, tip çevirmələri (Pipes) və best-practice yanaşmalarını dərindən öyrənirik.

---

## 📌 1. Route Parameters (`@Param`)

URL yolunda dynamic olan hissələri tutmaq üçün daxil edilir.

### 📍 1.1 Tək Parametr Və Tip Çevirməsi (`ParseIntPipe`):

```typescript
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {

  // Nümunə URL: GET /users/42
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe string kimi gələn "42"-ni avtomatik number 42 edir!
    // Əgər hərf (məs: /users/abc) daxil edilsə, NestJS avtomatik 400 Bad Request qaytarır.
    return { userId: id, type: typeof id };
  }
}
```

### 📍 1.2 Çoxlu URL Parametrləri:

```typescript
// Nümunə URL: GET /users/105/posts/88
@Get(':userId/posts/:postId')
getUserPost(
  @Param('userId', ParseIntPipe) userId: number,
  @Param('postId', ParseIntPipe) postId: number,
) {
  return { userId, postId };
}
```

### 📍 1.3 Bütün URL Parametrlərini Obyekt Kimi Almaq:

```typescript
@Get('category/:category/sub/:subcategory')
getCategoryParams(@Param() params: { category: string; subcategory: string }) {
  return {
    cat: params.category,
    sub: params.subcategory,
  };
}
```

---

## 🔍 2. Query Parameters (`@Query`)

URL-in sonuna əlavə olunan süzgəcləmə (filtering), axtarış (search), çeşidləmə (sorting) və səhifələmə (pagination) məlumatlarını oxumaq üçün istifadə olunur.

### 📍 2.1 Quraşdırılmış Susmaya Görə Dəyər (`DefaultValuePipe`):

İstifadəçi `page` və ya `limit` göndərmədikdə avtomatik standart dəyər təyin etmək üçün `DefaultValuePipe` çox rahatdır:

```typescript
import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {

  // Nümunə URL: GET /products?page=2&limit=20&search=phone
  @Get()
  getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return {
      page,
      limit,
      search: search || 'Axtarış sözü daxil edilməyib',
      skip: (page - 1) * limit,
    };
  }
}
```

### 📍 2.2 Bütün Query Parametrlərini Obyekt Kimi Almaq:

```typescript
@Get('filter-all')
getAllQuery(@Query() query: Record<string, any>) {
  return { receivedParams: query };
}
```

---

## 📑 3. Request Headers (`@Headers`)

Klient tərəfindən HTTP başlığında göndərilən `Authorization`, `User-Agent`, `Content-Type`, `Accept-Language` və xüsusi `X-API-KEY` kimi verilənləri almaq üçün `@Headers()` dekoratoru istifadə edilir.

### 📍 3.1 Tək HTTP Başlığını Oxumaq:

```typescript
import { Controller, Get, Headers } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Get('profile')
  getProfile(
    @Headers('authorization') authHeader: string, // Nümunə: "Bearer eyJhbGci..."
    @Headers('user-agent') userAgent: string,     // Nümunə: "Mozilla/5.0..."
    @Headers('x-api-key') apiKey?: string,
  ) {
    return {
      token: authHeader,
      clientBrowser: userAgent,
      apiKey,
    };
  }
}
```

### 📍 3.2 Bütün Header-ləri Obyekt Kimi Almaq:

```typescript
@Get('all-headers')
getAllHeaders(@Headers() headers: Record<string, string>) {
  return {
    headersCount: Object.keys(headers).length,
    allHeaders: headers,
  };
}
```

---

## ❓ 4. Niyə Native `@Req() req: Request` Əvəzinə NestJS Dekoratorları Seçilməlidir?

Express-dən gələn `@Req() req: Request` yazaraq da `req.params`, `req.query`, `req.headers` oxumaq mümkündür. Lakin bu **KÖHNƏ VƏ SƏHV** yanaşmadır.

### ❌ Niyə `@Req()` İlə Oxumaq Tövsiyə Olunmur?
1. **Pipes Dəstəyinin İtməsi:** `ParseIntPipe`, `ParseBoolPipe`, `DefaultValuePipe` kimi güclü alətlərdən istifadə edə bilmirsən (hər şeyi əllə `parseInt(req.query.page)` yazmalı olursan).
2. **Framework Asılılığı:** Tətbiq birbaşa Express-ə bağlanır. İrəlidə NestJS-i **Fastify** mühitinə keçirsən, kodlar sınacaq.
3. **Unit Testing:** Controller-ləri test edərkən bütün Express `Request` obyektini mock etmək çox çətindir. `@Param('id')` olduqda isə saniyələr içində test yazmaq olur.

---

## 📊 Müqayisə Cədvəli

| Dekarator | Nümunə URL / Header | Nə Vaxt İstifadə Olunur? |
| :--- | :--- | :--- |
| **`@Param('id')`** | `/users/42` | Mütləq lazım olan resurs ID-ləri və dinamik URL yolları üçün. |
| **`@Query('page')`** | `/users?page=1&limit=10` | Şərti filterlər, axtarış, sıralama və səhifələmə üçün. |
| **`@Headers('authorization')`** | `Authorization: Bearer xyz` | Kimlik doğrulaması (Auth), brauzer məlumatı və meta-başlıqlar üçün. |
