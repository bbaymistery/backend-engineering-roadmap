# 📚 NestJS Swagger (OpenAPI) Sənədləşdirməsi — Hərtərəfli Tədris Təlimatı (#23)

Salam! NestJS öyrənmə yolunda irəliləyən əziz tələbəm, xoş gəldin! 

Bu sənəddə **`23_Swagger_api_doc`** mövzusunu — backend proqramçılarının yazdığı API-ləri avtomatik olaraq sənədləşdirən və brauzerdə interaktiv sınaq səhifəsi yaradan **Swagger (OpenAPI)** alətini sıfırdan öyrənəcəksən.

---

## ❓ 1. Swagger Nədir? "Postman Var Axı, Swagger Nə Üçün Lazımdır?"

### 🅰️ Swagger (OpenAPI) Nədir?
**Swagger** — Bizim NestJS-də yazdığımız bütün API endpoint-lərini (`GET /users`, `POST /users` və s.) avtomatik oxuyan, onları vizual, gözəl bir veb səhifəyə (`http://localhost:3000/api`) çevirən və həmin səhifədən API-ləri birbaşa test etməyə imkan verən **rəsmi sənədləşdirmə (Documentation)** alətidir.

---

### 🅱️ "Postman Var Axı, Swagger Nə Üçün Daha Vacibdir?"

Əla sualdır! Gəl Postman ilə Swagger-i qarşılaşdıraq:

| Xüsusiyyət | Postman | Swagger (OpenAPI) |
| :--- | :--- | :--- |
| **İdarəetmə** | Hər bir API-ni tərtibatçı Postman-də **əllə tək-tək doldurmalıdır** (URL, Header, JSON Body). | NestJS kodunda yazdığın DTO və Controller-dən **avtomatik generasiya olunur**. |
| **Yenilənmə** | Koda yeni sahə əlavə edəndə Postman faylını əllə yeniləməyi unutsan, sənədləşmə köhnəlir. | Kodu dəyişən kimi Swagger səhifəsi **anında avtomatik yenilənir**. |
| **Frontend İlə Paylaşım** | Frontend tərtibatçısına JSON faylı (Collection) atmaq və ya Link paylaşmaq lazımdır. | Frontend-çiyə sadəcə `http://localhost:3000/api` linkini verirsən. O brauzerdə səhifəni açan kimi bütün API-ləri görür. |
| **Test İmkana** | Postman tətbiqini yükləmək lazımdır. | Sırf Brauzer üzərindən "Try it out" düyməsinə basaraq testi icra etmək olur. |

> 💡 **Qısası:** Postman sənin fərdi test alətindir. **Swagger isə layihənin canlı passportudur.** Frontendçi "Bu API-də hansı sahə string-dir, hansı number-dir?" deyə soruşanda ona sadəcə Swagger linkini göndərirsən!

---

## 🛠️ 2. `project-name` Layihəsində Swagger-in Qurulması (Step-by-Step)

Gəl `project-name` proyektimizdə Swagger-i necə addım-addım qurduğumuza baxaq:

---

### 1️⃣ Addım 1: Əsas Paketin Yüklənməsi

Terminalda layihə qovluğunda bu əmri icra edirik:
```bash
npm i @nestjs/swagger
```

---

### 2️⃣ Addım 2: `main.ts`-də Swagger-in Aktiv Edilməsi

`src/main.ts` faylına `DocumentBuilder` və `SwaggerModule` əlavə edirik:

```typescript
// 📄 project-name/src/main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  // 📄 Swagger OpenAPI Konfiqurasiyası
  const config = new DocumentBuilder()
    .setTitle('NestJS Tədris Layihəsi API')
    .setDescription('Swagger OpenAPI ilə avtomatik generasiya olunmuş interaktiv API Sənədləşməsi')
    .setVersion('1.0')
    .addTag('users', 'İstifadəçi Əməliyyatları') // API Qruplaşdırılması
    .addBearerAuth() // JWT Token dəstəyi üçün
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // 📍 Swagger səhifəsini '/api' marşrutuna bağlayırıq
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`🚀 Server başladı: http://localhost:${port}`);
  console.log(`📚 Swagger API Sənədi: http://localhost:${port}/api`);
}
bootstrap();
```

---

### 3️⃣ Addım 3: DTO Faylında `@ApiProperty` Bəzədicisi

Frontendçinin gələcək JSON body-də nümunə dəyərlər (example) görməsi üçün `@ApiProperty()` istifadə edirik:

```typescript
// 📄 project-name/src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Vəli Məmmədov',
    description: 'İstifadəçinin tam adı',
  })
  name: string;

  @ApiProperty({
    example: 'veli@example.com',
    description: 'İstifadəçinin elektron poçt ünvanı',
  })
  email: string;
}
```

---

### 4️⃣ Addım 4: Controller-də `@ApiTags`, `@ApiOperation`, `@ApiResponse`

Controller-də hər bir endpoint-in nə iş gördüyünüvə status kodlarını təyin edirik:

```typescript
// 📄 project-name/src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@ApiTags('users') // 🏷️ Swagger səhifəsində 'users' başlığı altında qruplaşdırır
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Bütün istifadəçilərin siyahısını almaq' })
  @ApiResponse({ status: 200, description: 'İstifadəçilər siyahısı uğurla qaytarıldı.' })
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID-yə görə tək bir istifadəçini tapmaq' })
  @ApiParam({ name: 'id', example: 1, description: 'İstifadəçinin unikal ID nömrəsi' })
  @ApiResponse({ status: 200, description: 'İstifadəçi tapıldı.' })
  @ApiResponse({ status: 404, description: 'İstifadəçi tapılmadı.' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni istifadəçi yaratmaq' })
  @ApiResponse({ status: 201, description: 'İstifadəçi uğurla yaradıldı.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
```

---

## 📋 3. Ən Çox İstifadə Olunan Swagger Bəzədiciləri (Cheatsheet)

| Decorator (Bəzədici) | Harada Yazılır? | Məqsədi Nədir? |
| :--- | :--- | :--- |
| **`@ApiTags('name')`** | Controller klasının üzərində | API-ləri kateqoriyalara bölür (məs: `users`, `auth`, `orders`). |
| **`@ApiOperation({ summary: '...' })`** | Controller metodunun üzərində | Endpoint-in nə iş gördüyünü qısa izah edir. |
| **`@ApiResponse({ status: 200, description: '...' })`** | Controller metodunun üzərində | Qayıdacaq HTTP status kodunu və mənasını bildirir. |
| **`@ApiParam({ name: 'id', example: 1 })`** | Controller metodunun üzərində | URL-də gələn parametr məlumatını sənədləşdirir. |
| **`@ApiProperty({ example: '...' })`** | DTO sahələrinin (field) üzərində | JSON body-də nümunə dəyər və təsvir göstərir. |
| **`@ApiBearerAuth()`** | Controller və ya metod üzərində | Swagger səhifəsinə JWT Token daxil etmək üçün "Authorize" düyməsi əlavə edir. |

---

## 🌐 4. Brauzerdə Sənədin İzlənilməsi

Serveri işə saldıqdan sonra (`npm run start:dev`):
👉 Brauzeri açırsan və **`http://localhost:3000/api`** ünvanına daxil olursan!

Orada açılan vizual interfeysdə:
1. Bütün `GET`, `POST` düymələrini görəcəksən.
2. Ən sağdakı **"Try it out"** düyməsinə basaraq elə brauzerin daxilindən API-yə sorğu atıb cavabı görə bilərsən!
