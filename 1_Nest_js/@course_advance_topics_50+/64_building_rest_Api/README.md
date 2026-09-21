# 🏗️ 🌐 ⚡ Building a Complete REST API in NestJS (#64)

Salam! **`64_building_rest_Api`** dərsinə xoş gəldin!

REST (Representational State Transfer) backend tətbiqlərində klientlə server arasında resurs idarəçiliyi üçün **ən məşhur və standart** arxitekturadır.

Bu dərslikdə NestJS-də sıfırdan **istehsalat səviyyəli (Production-Ready) tam CRUD (Create, Read, Update, Delete) REST API** qurmağı öyrənirik.

---

## 📐 1. REST API Konvensiyaları & HTTP Metodları

REST standartlarına əsasən hər bir resurs (məsələn: `posts`) üçün düzgün HTTP metodları və status kodları seçilməlidir:

| Əməliyyat | HTTP Metodu | URL Yolu | Uğurlu Status Kodu | Mənası |
| :--- | :--- | :--- | :--- | :--- |
| **Bütün Siyahını Al** | `GET` | `/posts` | `200 OK` | Bütün məqalələri (süzgəclə) qaytarır. |
| **Tək Resurs Oxu** | `GET` | `/posts/:id` | `200 OK` | Göstərilən ID-yə görə 1 məqalə qaytarır. |
| **Yeni Resurs Yarat** | `POST` | `/posts` | `201 Created` | Yeni məqalə yaradır. |
| **Resursu Yenilə (Qismən)**| `PATCH` | `/posts/:id` | `200 OK` | Yalnız dəyişən sahələri yeniləyir. |
| **Resursu Sil** | `DELETE` | `/posts/:id` | `204 No Content` | Resursu bazadan silir. |

---

## 🏗️ 2. Laylı Arxitektura (Layered Architecture)

NestJS layihələri 3 əsas təbəqədən ibarətdir:

1. **DTO (Data Transfer Object):** Gələn məlumatların yoxlanması (`class-validator`).
2. **Controller (Nəzarətçi):** HTTP sorğularını qəbul edir, routinq edir və servisi çağırır.
3. **Service (Biznes Məntiqi):** Verilənlər bazası ilə əməliyyatları icra edir və biznes məntiqini icra edir.

```
[ Client / Frontend ]
         │ (HTTP Request)
         ▼
 ┌───────────────┐
 │  Controller   │ ── (Decorators: @Get, @Post, @Param, @Body)
 └───────────────┘
         │ (Calls Method)
         ▼
 ┌───────────────┐
 │    Service    │ ── (Business Logic, CRUD, Database Operations)
 └───────────────┘
         │
         ▼
 ┌───────────────┐
 │ Entity / DB   │ ── (PostgreSQL / TypeORM / MongoDB)
 └───────────────┘
```

---

## 🛠️ 3. `PartialType` İlə Yeniləmə DTO-su (`UpdatePostDto`)

Yaradılma DTO-sundakı (`CreatePostDto`) sahələri yeniləmə DTO-su üçün təkrar yazmamaq üçün `@nestjs/mapped-types` paketinin `PartialType` alətindən istifadə edirik:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// CreatePostDto-dakı bütün sahələri avtomatik @IsOptional() edir
export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

---

## 🚨 4. Xətaların İdarə Olunması (`NotFoundException`)

Əgər istifadəçi bazada olmayan ID (məs: `GET /posts/999`) axtararsa, NestJS-in hazır **`NotFoundException`** sinfindən istifadə edirik:

```typescript
import { NotFoundException } from '@nestjs/common';

findOne(id: number): PostEntity {
  const post = this.posts.find((p) => p.id === id);
  if (!post) {
    throw new NotFoundException(`${id} ID-li məqalə tapılmadı!`);
  }
  return post;
}
```

---

## 📊 Xülasə Və Best-Practice Tövsiyələri

1. **PUT əvəzinə PATCH seçin:** Resursun bütün sahələrini dəyişmirsinizsə, `PATCH` istifadə etmək REST standartlarına daha uyğundur.
2. **Pipes istifadə edin:** `@Param('id', ParseIntPipe)` yazaraq string-dən number-ə çevirməni avtomatlaşdırın.
3. **Düzgün Status Kodları:** Yaratmaq üçün `201 Created`, Silmək üçün `204 No Content` vermək peşəkar API əlamətidir.
