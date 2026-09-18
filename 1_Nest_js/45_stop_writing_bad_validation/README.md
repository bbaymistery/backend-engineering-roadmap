# 🛑 NestJS: Stop Writing Bad Validation (#45)

Salam! **`45_stop_writing_bad_validation`** dərsinə xoş gəldin!

Müəllimin dərslikdə *"Stop Writing Bad Validation"* (Səhv Validasiya Yazmağı Dayandırın!) dediyi məsələni ən sadə dildə izah edirik.

Bu dərsin əsas məqsədi proqramçıların Controller daxilində yazdığı lazımsız `if / else` yoxlamalarını yığışdırıb, NestJS-in təqdim etdiyi **9 Daxili Hazır Pipe-dan (Built-in Pipes)** necə peşəkarca istifadə etməyi öyrənməkdir.

---

## 🛑 1. "Bad Validation" (Səhv Validasiya) Nədir?

### ❌ SƏHV YANAŞMA (Bad Validation):
Çox vaxt proqramçılar Controller daxilində gələn parametrləri əllə yoxlayırlar:

```typescript
// ❌ PİS KOD: Controller `if/else` xətaları ilə dolub, oxunmur!
@Get(':id')
getUser(@Param('id') id: string) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new BadRequestException('ID rəqəm olmalıdır!');
  }
  if (numericId <= 0) {
    throw new BadRequestException('ID müsbət olmalıdır!');
  }
  return this.userService.getUser(numericId);
}
```

---

## ✅ 2. "Good Validation" (Built-in NestJS Pipes)

NestJS bizə 9 hazır daxili Pipe verir. Yuxarıdakı mürəkkəb kodu silib **sadəcə 1 sətir** yazırıq:

```typescript
// ✅ PEŞƏKAR KOD: ParseIntPipe avtomatik rəqəmə çevirir və rəqəm deyilsə 400 xətası verir!
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) {
  return this.userService.getUser(id);
}
```

---

## 🛠️ 3. NestJS Daxili 9 Hazır Pipe-ın Tam Siyahısı (1.png Analizi)

`1.png` şəklindəki bütün daxili Pipe-ların nə iş gördüyü aşağıdakı cədvəldə göstərilmişdir:

| Built-in Pipe          | Nə İş Görür?                                                                       | Nümunə İstifadəsi                                       |
| :--------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------ |
| **`ValidationPipe`**   | DTO-da `class-validator` bəzədicilərini (`@IsEmail()`, `@IsString()`) yoxlayır.    | `@UsePipes(ValidationPipe)`                             |
| **`ParseIntPipe`**     | `"123"` string-ini `123` tam ədədinə çevirir və rəqəm deyilsə xəta verir.          | `@Param('id', ParseIntPipe)`                            |
| **`ParseFloatPipe`**   | `"3.14"` string-ini `3.14` kəsr ədədinə çevirir.                                   | `@Query('price', ParseFloatPipe)`                       |
| **`ParseBoolPipe`**    | `"true"` / `"false"` string-ini real `boolean` tipinə çevirir.                     | `@Query('isActive', ParseBoolPipe)`                     |
| **`ParseArrayPipe`**   | Vergüllə ayrılmış string-i (`"1,2,3"`) massivə çevirir (`[1, 2, 3]`).              | `@Query('ids', new ParseArrayPipe({ items: Number }))`  |
| **`ParseUUIDPipe`**    | Gələn İD-nin həqiqətən UUID v4 formatında olduğunu yoxlayır.                       | `@Param('id', new ParseUUIDPipe({ version: '4' }))`     |
| **`ParseEnumPipe`**    | Gələn parametrin təyin olunmuş Enum daxilində olub-olmadığını yoxlayır.            | `@Param('status', new ParseEnumPipe(UserStatus))`       |
| **`DefaultValuePipe`** | Parametr göndərilmədikdə müəyyən olunmuş susmaya görə (default) dəyəri mənimsədir. | `@Query('page', new DefaultValuePipe(1), ParseIntPipe)` |
| **`ParseFilePipe`**    | Yüklənən faylın həcmini və tipini (png, pdf) yoxlayır.                             | `@UploadedFile(new ParseFilePipe({...}))`               |

---

## 💡 4. Nümunə Kodlar (Real Layihə Nümunəsi)

### A) Pagination (Səhifələmə) üçün DefaultValue + ParseInt
İstifadəçi `page` və `limit` göndərmədikdə avtomatik `page=1`, `limit=10` olsun:

```typescript
@Get()
getUsers(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  return this.userService.getUsers(page, limit);
}
```

---

### B) UUID Yoxlanışı (ParseUUIDPipe)
İstifadəçi İD-sinin düzgün UUID v4 olmasını tələb etmək:

```typescript
@Get(':uuid')
getProfile(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
  return this.userService.getByUuid(uuid);
}
```

---

### C) Enum Yoxlanışı (ParseEnumPipe)
Parametrin yalnız `ACTIVE`, `INACTIVE` və ya `PENDING` ola biləcəyini yoxlamaq:

```typescript
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Get('status/:type')
getByStatus(@Param('type', new ParseEnumPipe(UserStatus)) status: UserStatus) {
  return this.userService.getByStatus(status);
}
```

---

## 🎯 5. Qızıl Xülasə

1. **Controller-də əllə `if (isNaN(...))` yazmaq SƏHVDİR!**
2. NestJS-in **Built-in Pipe-larından** (`ParseIntPipe`, `ParseUUIDPipe`, `DefaultValuePipe`) istifadə et.
3. Bu Pipe-lar kodu təmiz saxlayır və avtomatik olaraq `400 Bad Request` xətaları qaytarır.
