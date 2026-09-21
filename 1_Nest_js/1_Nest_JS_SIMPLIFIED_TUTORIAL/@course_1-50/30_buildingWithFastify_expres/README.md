# 🚀 NestJS: Building with Fastify & Express (#30)

Salam! **`30_buildingWithFastify_expres`** dərsinə xoş gəldin! 

Bu sənəddə müəllimin nə üçün "Fastify-ı çox istifadə etmirəm" dediyini, NestJS-in **Platform-Agnostic** (Platformadan Müstəqil) arxitekturasını, Express vs Fastify müqayisəsini və bu bilikləri **CV-də necə təqdim edəcəyini** ətraflı öyrənəcəksən.

---

## ❓ 1. Müəllim Niyə "Çox İstifadə Etmirəm" Dedi, Amma İzah Etdi?

### 💡 Reallıq:
- **Express.js** Node.js dünyasının ən köhnə, ən populyar və ən böyük ekosisteminə malik freymvorkudur. Layihələrin **90%-i** susmaya görə (default) Express ilə yazılır.
- **Fastify** isə Express-dən **2-3 dəfə daha sürətli** və yaddaşı (RAM) daha az işlədən müasir freymvorkdur.

### 🎯 Niyə NestJS Fastify-ı dəstəkləyir?
NestJS-in ən böyük üstünlüklərindən biri **"Platform Abstraction"**dır. Yəni NestJS təkcə Express-ə bağlı deyil. Sabah şirkətində saniyədə 50,000 sorğu gələn böyük bir **Microservice** və ya **Real-time API** yazmalı olsan, bütün kodunu sıfırdan yazmaq lazım deyil! Sadəcə `main.ts`-də adapteri dəyişib Fastify-a keçirsən. Müəllim də bunu NestJS-in nə qədər güclü arxitekturaya malik olduğunu göstərmək üçün izah edir.

---

## 📊 2. Express vs Fastify Müqayisə Cədvəli

| Xüsusiyyət             | Express.js (Default)                 | Fastify (High Performance)                                   |
| :--------------------- | :----------------------------------- | :----------------------------------------------------------- |
| **Performans**         | Yaxşı (Standart Node.js)             | Mükəmməl (Express-dən 2-3 dəfə sürətli)                      |
| **Yaddaş Sərfi (RAM)** | Daha çox                             | Daha az (Low Memory)                                         |
| **Ekosistem**          | Nəhəng (Massive Middleware)          | Sürətlə böyüyən (Plugin-lər)                                 |
| **JSON Parser**        | Standart (`JSON.parse`)              | Schema-Based (Əvvəlcədən təyin olunmuş sxemlə sürətli parse) |
| **İstifadə Sahəsi**    | Standart Monolit, CRUD, Rest API-lər | Böyük sorğu yükü (High Throughput), Mikroservislər           |

---

## 🏗️ 3. Platform-Agnostic Kod nədir və Necə Yazılır?

NestJS-də kod yazarkən ən vacib **Best Practice** (Qızıl Qayda) kodunun platformadan asılı olmamasıdır.

### ✅ DOĞRU (Platform-Agnostic Code):
Bu kod həm Express-də, həm də Fastify-da **eyni şəkildə** işləyir:

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    // NestJS avtomatik olaraq cavabı JSON formatında qaytarır (Express və Fastify adapteri üçün)
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

---

### ⚠️ SƏHV (Platform-Specific Code - Raw Request/Response):
Əgər kimsə aşağıdakı kimi raw `@Res()` istifadə etsə, adapter dəyişdikdə kodu sınacaq:

```typescript
// ❌ Express-ə Spesifik Yazılış (Fastify-a keçsən cavab getməyəcək):
import { Request, Response } from 'express';

@Get()
findAllExpress(@Req() req: Request, @Res() res: Response) {
  res.status(200).json({ message: 'Express' }); // 👈 Fastify-da reply.send() olmalıdır!
}

// ❌ Fastify-a Spesifik Yazılış:
import { FastifyRequest, FastifyReply } from 'fastify';

@Get()
findAllFastify(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
  reply.status(200).send({ message: 'Fastify' });
}
```

> 📌 **Qeyd:** Əgər mütləq `@Res()` istifadə etməlisənsə və platformadan müstəqil qalmaq istəyirsənsə, `@Res({ passthrough: true })` istifadə etməlisən!

---

## ⚡ 4. Fastify Adapterini Qoşmaq və Konfiqurasiya Edilməsi

```bash
npm install @nestjs/platform-fastify fastify
```

```typescript
// 📄 main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,          // Fastify-ın daxili logger-i (Pino)
      trustProxy: true,       // Nginx/Cloudflare arxasında IP-ni düzgün oxumaq üçün
      maxParamLength: 200,    // URL parametr uzunluğu məhdudiyyəti
    })
  );

  // Fastify default olaraq '127.0.0.1' dinləyir. Docker/Kubernetes üçün '0.0.0.0' yazılmalıdır!
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

---

## 🌟 5. Müəllimin Tövsiyə Etdiyi Qızıl Qaydalar (Best Practices)

1. **Controller-lərdə raw `@Req()` və `@Res()` istifadə etməkdən qaçın.** NestJS-in standart bəzədicilərindən (`@Body()`, `@Param()`, `@Query()`) və `return` ifadəsindən istifadə et.
2. **Cavabı dəyişdirmək üçün Raw Response əvəzinə Interceptor-lardan istifadə et.**
3. **Platformaya spesifik xüsusiyyətləri Service klasları daxilində bük (Wrap et).**
4. **Prodakşına çıxarmazdan əvvəl seçdiyin platformada (Express və ya Fastify) test et.**

---

## 📝 6. Bu Bilikləri CV-yə Necə Yazmalı və Müsahibədə Necə Cavab Verməlisən?

### 💼 CV-yə Nə Yazmalısan?
CV-də **Skills / Backend Technologies** bölməsinin altına belə yaza bilərsən:

```text
• Node.js & TypeScript
• NestJS (Express.js & Fastify Adapters)
• RESTful APIs, Middleware, Interceptors, Platform Abstraction
```

### 💬 Müsahibədə (Interview-da) Soruşsalar Nə Deməlisən?

**Sual:** *"Fastify ilə təcrübən var? Express ilə Fastify-ın fərqi nədir?"*

**Sənin Senior Kimi Cavabın:**
> *"Əsasən NestJS layihələrində Express.js adapterindən istifadə edirik, çünki ekosistemi genişdir və çoxlu middleware dəstəyi var. Lakin NestJS-in **Platform-Agnostic** arxitekturasını yaxşı bildiyim üçün yüksək performans və aşağı RAM sərfi (Low Memory & High Throughput) tələb olunan mikromodullar və ya böyük sorğu yükü olan servislərdə `@nestjs/platform-fastify` adapteri ilə Fastify-a keçid etməyi bilirəm. Həmçinin kod yazarkən Controller-ləri raw `@Res()` istifadə etmədən **Platform-Agnostic** tərzdə yazmağa diqqət edirəm ki, gələcəkdə adapter dəyişikliyi biznes mentallığına təsir etməsin."*

🔥 **Bu cavab HR və Tech Lead tərəfindən çox yüksək qiymətləndiriləcək!**
