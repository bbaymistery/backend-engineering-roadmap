# 🔐 NestJS: Authentication & Authorization (#32)

Salam! **`32_Authorization`** dərsinə xoş gəldin! 

Bu sənəddə NestJS-də istifadəçilərin kimliyini doğrulamaq (**Authentication**) və onların müəyyən resurslara (məsələn, Admin panelə) giriş icazəsini (**Authorization - RBAC**) tənzimləməyi ən sadə dildə, sxemlər və təmiz TypeScript kodları ilə sıfırdan öyrənəcəksən.

---

## ❓ 1. Authentication vs Authorization Fərqi Nədir?

Çox vaxt bu iki anlayış bir-biri ilə qarışdırılır. Gəl aralarındakı fərqi sadə həyati analogiya ilə anlayaq:

| Anlayış | Mənası | Həyati Analogiya | NestJS-dəki Rolu |
| :--- | :--- | :--- | :--- |
| **Authentication (AuthN)** | **"Sən kimsən?"** | Binanın qapısındakı mühafizəçiyə şəxsiyyət vəsaitini (və ya pasportunu) göstərib binaya daxil olmaq. | İstifadəçi email və şifrəsi ilə daxil olur, sistem ona **JWT Token** qaytarır. |
| **Authorization (AuthZ)** | **"Sənin bura girməyə icazən var?"** | Binaya girdikdən sonra yalnız VİP kartı olanların 5-ci mərtəbədəki müdir otağına keçə bilməsi. | Gələn JWT tokenindəki rola yoxlanılır: İstifadəçi `admin`-dirmi? (`RolesGuard`). |

---

## 🛠️ 2. Ən Populyar Kitabxanalar və Paketlər

NestJS-də təhlükəsizlik sistemini qurmaq üçün aşağıdakı standart paketlərdən istifadə olunur:

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt
npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
```

- **`@nestjs/passport`**: NestJS ilə Passport.js inteqrasiyası.
- **`@nestjs/jwt`**: JWT (JSON Web Token) yaratmaq və imzalamaq üçün.
- **`bcrypt`**: Şifrələri bazada açıq şəkildə saxlamamaq üçün **hash-ləmək** (şifrələmək) üçün.
- **`passport-google-oauth20`**: Google ilə giriş (Social Login) üçün.

---

## 🏗️ 3. NestJS Authentication Memarlığı (Guards & Passport Strategies)

NestJS-də Auth sistemi 2 əsas laydan ibarətdir:

```text
Sorğu (Request) ──► [ Guards Layer (JwtAuthGuard / RolesGuard) ]
                               │
                               ▼ (Valideyn Strategiyaya Yönləndirilir)
                    [ Passport Strategy (JwtStrategy / LocalStrategy) ]
                               │
                               ▼ (Doğrulandıqda `req.user` doldurulur)
                    [ Controller Method (@Get('profile')) ]
```

---

## 💻 4. Addım-Addım Authentication & Authorization İmplementasiyası

---

### Step 1: `AuthModule` Yaradılması (`auth.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_123',
      signOptions: { expiresIn: '1h' }, // Token 1 saat etibarlıdır
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

---

### Step 2: Login & Token Yaratma Servisi (`auth.service.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. İstifadəçinin email və şifrəsini yoxlayır
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result; // Şifrəsiz istifadəçi məlumatı qaytarılır
    }
    return null;
  }

  // 2. İstifadəçiyə JWT Access Token verir
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

---

### Step 3: Passport Strategiyaları (`local.strategy.ts` & `jwt.strategy.ts`)

#### A) Local Strategy (Login Əməliyyatı Üçün)
```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Email və ya şifrə yanlışdır!');
    }
    return user;
  }
}
```

#### B) JWT Strategy (Qorunan Route-lara Giriş Üçün)
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header-dən "Bearer <token>" oxuyur
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_123',
    });
  }

  async validate(payload: any) {
    // Bu obyekt avtomatik `req.user` daxilinə mənimsədilir
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

---

### Step 4: Custom Guards (`jwt-auth.guard.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

### Step 5: Role-Based Access Control - RBAC (Authorization)

İstifadəçinin **Admin** olub-olmadığını yoxlamaq üçün xüsusi **Decorator** və **RolesGuard** yaradırıq:

#### A) Roles Decorator (`roles.decorator.ts`)
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

#### B) Roles Guard (`roles.guard.ts`)
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Əgər heç bir rol tələb olunmursa, keçidə icazə ver
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role); // İstifadəçinin rolu tələb olunan rollar arasındadırsa 'true'
  }
}
```

---

### Step 6: Controller-də İstifadəsi (`auth.controller.ts`)

```typescript
import { Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 1. LOGIN (Public Route) - Email və Pass doğrulayıb JWT verir
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // 2. PROFILE (Protected Route) - Yalnız login olmuş istifadəçilər girə bilər
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // 3. ADMIN PANEL (Protected + Authorized) - Yalnız 'admin' rolu olanlar girə bilər!
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdminData() {
    return { message: 'Məxfi Admin Məlumatları' };
  }
}
```

---

## 🎯 5. Qızıl Xülasə

1. **Authentication:** Kimliyi doğrulayır (Login -> Access Token).
2. **Authorization:** Səlahiyyəti yoxlayır (Role -> Access Control).
3. **Passport Strategies:** Login üçün `LocalStrategy`, qorunan sorğular üçün `JwtStrategy`.
4. **Guards:** `@UseGuards(JwtAuthGuard, RolesGuard)` sorğunu saxlayaraq token və rolu yoxlayan qapıçıdır.
