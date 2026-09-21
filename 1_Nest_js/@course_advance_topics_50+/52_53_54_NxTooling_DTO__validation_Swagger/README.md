# ⚡ Nx Tooling, PNPM Workspaces, Husky, DTO Validation & Swagger (#52-#54)

Salam! **`52_53_54_NxTooling_DTO__validation_Swagger`** dərsinə xoş gəldin!

Bu layihədə **Nx Tooling**, **PNPM Workspaces**, **Husky (Git Hooks)** və **DTO Validation** mövzuları üzərinə tam **Swagger (OpenAPI Interactive Documentation)** inteqrasiyası quraşdırıldı!

---

## 📑 Swagger (OpenAPI) Nə Kömək Edir?

- **`http://localhost:4002/api/docs`** ünvanında tam interaktiv **OpenAPI Sənədləşməsi (UI)** açılır.
- Frontend proqramçılar Postman-ə ehtiyac duymadan brauzerdən birbaşa DTO doğrulamasını, sahələrin tiplərini, nələr göndərə biləcəklərini görürlər və canlı test edirlər (`Try it out`)!

---

## 🛡️ DTO Validation Nə Kömək Edir?

- **`packages/shared-dto/src/user.dto.ts`**: Ortak DTO üzərində `@IsEmail()`, `@IsString()`, `@MinLength()`, `@IsEnum()`, `@Min()`, `@Max()` kimi xüsusi **`class-validator`** və Swagger **`@ApiProperty()`** dekoratorları daxil edildi.
- **`apps/nestjs-advance-dto-01/src/main.ts`**: NestJS-in qlobal **`ValidationPipe`** mexanizmi (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`) və Swagger module aktivləşdirildi.

---

## 📂 Layihənin Qovluq Strukturu

```text
1_Nest_js/52_53_54_NxTooling_DTO__validation_Swagger/
├── .husky/                         ──► 🐶 Git commit-lərə nəzarət edən Husky keşikçisi
│   ├── pre-commit                  ──► Commit-dən əvvəl lint & prettier yoxlayır
│   └── commit-msg                  ──► Commit mesajının formatını (commitlint) yoxlayır
├── apps/                           ──► 🚀 Müstəqil backend tətbiqləri
│   ├── nestjs-advance-auth-app-02/ ──► Port 4001-də işləyən Auth servisi
│   └── nestjs-advance-dto-01/      ──► Port 4002-də işləyən DTO Validation & Swagger Docs servisi
├── packages/                       ──► 📦 Ortak DTO-lar və kitabxanalar
│   └── shared-dto/                 ──► CreateUserDto (@packages/shared-dto) + Validation & Swagger decorators!
├── commitlint.config.js            ──► Commit mesajı qaydaları (feat, fix, docs və s.)
├── pnpm-workspace.yaml             ──► PNPM monorepo qovluq xəritəsi
├── nx.json                         ──► Nx Ağıllı Keşləmə (Caching) tənzimləməsi
├── package.json                    ──► Ana package.json, dependencies və build skriptləri
└── tsconfig.json                   ──► @packages/shared-dto alias yolları
```

---

## 🛠️ Skriptlər və İstifadə Əmrləri (`package.json`)

```bash
# 🏗️ Bütün tətbiqləri VƏ packages-ləri paralell olaraq build etmək:
pnpm run build-all

# 🐶 Husky Git hook-larını aktivləşdirmək:
pnpm run prepare

# 🔐 Auth App-i işlətmək (Port 4001):
pnpm run start:auth

# 📋 DTO Validation & Swagger App-i işlətmək (Port 4002):
pnpm run start:dto
```

---

## 📄 Əlaqədar Sənədlər:
- 👉 **[SWAGGER_GUIDE.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/52_53_54_NxTooling_DTO__validation_Swagger/SWAGGER_GUIDE.md)** (Swagger OpenAPI interaktiv bələdçisi)
- 👉 **[DTO_VALIDATION_GUIDE.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/52_53_54_NxTooling_DTO__validation_Swagger/DTO_VALIDATION_GUIDE.md)** (DTO Validation & ValidationPipe ətraflı bələdçisi)
- 👉 **[PROJECT_GUIDE.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/52_53_54_NxTooling_DTO__validation_Swagger/PROJECT_GUIDE.md)** (Daha təfərrüatlı texniki bələdçi)
