# 🔍 📊 Search, Sort & Pagination APIs (#55)

Salam! **`55_Search_Sort_PaginationAPIs`** dərsinə xoş gəldin!

Real layihələrdə (məsələn: e-ticarət məhsul siyahısı, istifadəçi cədvəlləri, xəbər lentləri) verilənlər bazasında **100,000 istifadəçi** olduqda, backend **heç vaxt bütün 100,000 məlumatı tək sorğu ilə qaytarmaz!** Əgər qaytarsa, server çökər, RAM dolar və frontend donar.

Bu sənəddə **Search (Axtarış)**, **Sort (Sıralama)** və **Pagination (Səhifələmə)** mexanizmlərini peşəkar səviyyədə sıfırdan öyrənəcəksən.

---

## ❓ 1. Üç Əsas Anlayış Nədir?

1. **Pagination (Səhifələmə):** Məlumatları hissə-hissə (məsələn, 10-10) gətirmək.
   - **`page`**: Hansı səhifədəyik? (Default: `1`)
   - **`limit`**: Hər səhifədə neçə məlumat olsun? (Default: `10`)
2. **Search (Axtarış):** Mətnə görə axtarış aparmaq.
   - **`search`**: Məsələn `?search=aytac` (İstifadəçi adında və ya emailində axtarır).
3. **Sort (Sıralama):** Məlumatları müəyyən sahəyə görə sıralamaq.
   - **`sortBy`**: Hansı sahəyə görə? (`createdAt`, `name`, `price`).
   - **`sortOrder`**: Artan sırayla (`ASC`) yoksa azalan sırayla (`DESC`)?

---

## 📐 2. Pagination Düsturu (Riyazi Hesablama)

Verilənlər bazasından (SQL, TypeORM, Prisma, MongoDB) məlumat gətirərkən 2 əsas rəqəm lazımdır:
- **`skip`** (Neçə məlumatın üstündən tullanırıq?)
- **`take` / `limit`** (Neçə məlumat götürürük?)

### 🧮 Qızıl Düstur:
```text
skip = (page - 1) * limit
```

#### Misallarla İzah:
- **Səhifə 1 (page = 1, limit = 10):** `skip = (1 - 1) * 10 = 0` ➔ İlk 10 məlumatı götürür (0-dan 10-a qədər).
- **Səhifə 2 (page = 2, limit = 10):** `skip = (2 - 1) * 10 = 10` ➔ İlk 10 məlumatı ötürür, növbəti 10-u götürür (10-dan 20-yə qədər).
- **Səhifə 3 (page = 3, limit = 10):** `skip = (3 - 1) * 10 = 20` ➔ İlk 20 məlumatı ötürür, 20-30 arasını götürür.

---

## 📝 3. DTO Strukturu (`pagination.dto.ts`)

URL-dən gələn Query parametrləri (məsələn: `?page=2&limit=10`) standart olaraq **String** kimi gəlir. NestJS-də `class-transformer` istifadə edərək onları avtomatik **Number**-ə çeviririk:

```typescript
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number) // String "1"-i Number 1-ə çevirir!
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Ən çox 100 element
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
```

---

## 🏛️ 4. Standart API Cavab Strukturu (Metadata + Data)

Peşəkar backend proqramçı yalnız `[ { id: 1 }, { id: 2 } ]` qaytarmır! Frontend-də səhifələmə düymələrinin (1, 2, 3... Next, Prev) düzgün görünməsi üçün **Metadata** qaytarılır:

```json
{
  "data": [
    { "id": 11, "name": "User 11", "email": "user11@example.com", "role": "User" },
    { "id": 12, "name": "User 12", "email": "user12@example.com", "role": "User" }
  ],
  "meta": {
    "totalItems": 50,     // Bazadakı ümumi tapılan istifadəçi sayı
    "itemCount": 10,      // Bu cavabda neçə istifadəçi var
    "itemsPerPage": 10,   // Səhifə limiti
    "totalPages": 5,      // Cəmi neçə səhifə var (50 / 10 = 5)
    "currentPage": 2      // İndi 2-ci səhifədəyik
  }
}
```

---

## 🗄️ 5. Mock Kod (Süni Yaddaş) vs Real TypeORM Kodu

Biz nə üçün kodumuzda **Mock Users (Süni Massiv)** yazdıq, amma rəydə **TypeORM** kodunu göstərdik?

### 💡 Səbəb:
Bu qovluqda hazırda real PostgreSQL bazası qoşulu olmadığı üçün sistemi kompyuterində dərhal başa düşüb test edə biləsən deyə JavaScript-in doğma massiv metodları (`filter`, `sort`, `slice`) ilə sistemin simulyasiyasını qurduq.

Lakin **REAL İŞ MÜHİTİNDƏ (Production)** 1,000,000 istifadəçini Node.js RAM-ına yükləyib `filter()` etmirlər. Bütün axtarış və səhifələmə işini **Verilənlər Bazasına (PostgreSQL/MySQL)** etdirirlər!

---

### 📊 Yan-Yana Müqayisə Cədvəli:

| Əməliyyat | Süni Kodumuz (Mock JS Array) | Real TypeORM Kodu (Database) | Şərti SQL Mənası |
| :--- | :--- | :--- | :--- |
| **Search (Axtarış)** | `users.filter(u => u.name.includes(s))` | `where: { name: ILike('%search%') }` | `WHERE name ILIKE '%search%'` |
| **Sort (Sıralama)** | `users.sort((a,b) => ...)` | `order: { [sortBy]: sortOrder }` | `ORDER BY name ASC` |
| **Skip (Ötürmək)** | `skip = (page - 1) * limit` | `skip: skip` | `OFFSET 10` |
| **Take (Limit)** | `users.slice(skip, skip + limit)` | `take: limit` | `LIMIT 10` |

---

### 🔥 TypeORM-da `findAndCount()` Nə İş Görür?

TypeORM-un `this.userRepository.findAndCount()` metodu **eyni anda 2 SQL sorğusu** vurur:
1. `data` ──► Səhifə üçün yalnız lazımi 10 istifadəçini gətirir (`LIMIT 10 OFFSET 10`).
2. `totalItems` ──► Bazadakı bütün tapılan istifadəçilərin ümumi sayını hesablayır (`SELECT COUNT(*)`).

Bu metod sənə `[data, totalItems]` cütlüyünü qaytarır!


## 🌐 6. Nümunə URL Sorğuları

- **Səhifə 1-i gətir (Defolt 10 element):**
  `GET /users`
- **Səhifə 2, hər səhifədə 5 element:**
  `GET /users?page=2&limit=5`
- **Adında "ali" olanları axtar və ada görə A-dan Z-yə sırala:**
  `GET /users?search=ali&sortBy=name&sortOrder=ASC`
- **Hamısını bir yerdə istifadə et:**
  `GET /users?page=1&limit=20&search=admin&sortBy=createdAt&sortOrder=DESC`

---

## 🧠 7. TypeScript Generics (`<T>`) Nədir? (Niyə `PaginatedResult<T>` Yazdıq?)

Sənəddə gördüyün **`<T>`** harfi TypeScript-də **Generic (Ümumi Şablon Tip)** adlanır.

```typescript
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
```

### 💡 Niyə `<T>` İstifadə Edirik? (Həyati Misal)
Təsəvvür et ki, layihəndə 5 fərqli bölmə var:
1. `User` (İstifadəçilər)
2. `Product` (Məhsullar)
3. `Order` (Sifarişlər)

Əgər `<T>` olmasaydı, sən 3 ayrı interfeys yazmalı idin:
- `PaginatedUserResult` (data: `User[]`)
- `PaginatedProductResult` (data: `Product[]`)
- `PaginatedOrderResult` (data: `Order[]`)

### ✅ Generics (`<T>`) İlə TƏK BİR ŞABLON Yazırıq:
`T` burada dinamik yerinə yetirici dəyişəndir. Sən hansı tipi ötürsən, `data` avtomatik həmin tipin massivinə çevrilir:

- `PaginatedResult<User>` ──► `data: User[]` olur!
- `PaginatedResult<Product>` ──► `data: Product[]` olur!
- `PaginatedResult<Order>` ──► `data: Order[]` olur!

**Nəticə:** Kodu 10 dəfə təkrar yazmaqdan xilas oluruq və TypeScript-in mükəmməl avto-tamamlama (intelliSense) gücünü qazanırıq! ⚡
