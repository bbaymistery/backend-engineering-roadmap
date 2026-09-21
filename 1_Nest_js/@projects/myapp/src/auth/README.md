# 🔐 Auth Qovluğu (`src/auth`)

### Nə üçün istifadə olunur?
İstifadəçilərin sistemə daxil olması (Login), icazələrin idarə olunması (Authentication & Authorization) bu modulda yerləşir.

### Faylların İzahı:
- **`auth.controller.ts`**: Giriş sorğularını qarşılayır (`POST /auth/login`).
- **`auth.service.ts`**: `UserService`-dən istifadə edərək e-poçt ünvanını yoxlayır və giriş icazəsi (Token) verir.
- **`auth.module.ts`**: Auth modulunun birləşmə qovluğudur.
