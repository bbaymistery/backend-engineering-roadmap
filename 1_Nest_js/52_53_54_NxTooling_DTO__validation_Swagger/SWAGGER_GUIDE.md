# 📑 NestJS Swagger (OpenAPI) İnteqrasiyası Bələdçisi

Salam! Bu layihədə **Nx Monorepo**və **DTO Validation** mövzuları üzərinə **Swagger (OpenAPI Documentation)** inteqrasiyası tam olaraq əlavə edildi!

---

## ❓ 1. Swagger Nədir və Niyə Vacibdir?

### ⚠️ Problem:
Backend proqramçı API endpoints (məsələn: `POST /dto-test/validate-user`) yazanda, Frontend proqramçılar (React/Next.js/Vue) hər dəfə soruşur:
- *"Bu endpoint-ə hansı JSON sahələrini göndərməliyəm?"*
- *"Email məcburidirmi? Yoxsa ixtiyaridir?"*
- *"Request-ə hansı header-lər lazımdır?"*
- Postman kolleksiyasını hər dəfə əllə yeniləmək böyük əziyyətdir.

### ✅ Həll (NestJS Swagger `@nestjs/swagger`):
Swagger backend kodlarından avtomatik interaktiv **Veb Sənədləşmə (Interactive UI)** hazırlayır.
Sən sadəcə koda `@ApiProperty()` və `@ApiOperation()` yazırsan, NestJS avtomatik interaktiv brauzer paneli yaradır:
👉 **`http://localhost:4002/api/docs`**

---

## ⚙️ 2. Quraşdırma Addımları

### Addım 1: Paketlərin Yüklənməsi
```bash
pnpm add @nestjs/swagger swagger-ui-express
```

### Addım 2: `main.ts` daxilində Swagger Aktivləşdirmək
```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('NestJS Microservice API Documentation')
  .setDescription('Swagger OpenAPI Documentation with DTO Validation')
  .setVersion('1.0')
  .addTag('DTO Validation Test')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document); // 👈 http://localhost:4002/api/docs ünvanında açılır
```

---

## 📝 3. DTO-larda Swagger Dekoratorları (`packages/shared-dto/src/user.dto.ts`)

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'İstifadəçinin tam adı',
    example: 'Aytac Aliyeva',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'İstifadəçinin email ünvanı',
    example: 'aytac@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: UserRole,
    description: 'İstifadəçinin rolu (Admin, User, Guest)',
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    description: 'İstifadəçinin yaşı (Ən azı 18)',
    example: 25,
  })
  @IsOptional()
  age?: number;
}
```

---

## 🎮 4. Controller-də Swagger Bəzəkləri (`app.controller.ts`)

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('DTO Validation Test')
@Controller('dto-test')
export class AppController {

  @Post('validate-user')
  @ApiOperation({ summary: 'İstifadəçi məlumatlarını DTO Validation ilə yoxlayır və yaradır' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'İstifadəçi müvəffəqiyyətlə doğrulandı', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation xətası' })
  validateUser(@Body() createUserDto: CreateUserDto) {
    return { success: true, validatedData: createUserDto };
  }
}
```

---

## 🚀 5. Brauzerdə Yoxlamaq

1. Tətbiqi işə sal: `pnpm run start:dto`
2. Brauzeri aç: **[http://localhost:4002/api/docs](http://localhost:4002/api/docs)**
3. İnteraktiv **"Try it out"** düyməsinə basaraq birbaşa brauzerdən POST sorğuları atıb canlı test edə bilərsən! ⚡
