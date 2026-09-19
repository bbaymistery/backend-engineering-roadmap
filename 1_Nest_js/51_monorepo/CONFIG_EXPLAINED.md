# ⚙️ Monorepo Konfiqurasiya Fayllarının Dərin İzahı

Salam! Bu sənəddə **Monorepo** layihəsindəki konfiqurasiya fayllarını (`package.json`, `nest-cli.json`, `tsconfig.json`) sətir-sətir öyrənəcəksən.

---

## 📄 1. `package.json` İzahı

Monorepo-da cəmi **BİR DƏNƏ** ana `package.json` olur. Bütün `apps/` və `libs/` eyni paketləri paylaşıram.

```json
{
  "name": "nestjs-monorepo",
  "private": true,
  "scripts": {
    "build": "nest build", 
    // 1️⃣ Auth app-ini daxildə işlədir:
    "start:dev-auth": "nest start --watch auth-app",

    // 2️⃣ User app-ini daxildə işlədir:
    "start:dev-user": "nest start --watch user-app",

    // 3️⃣ Concurrently kitabxanası ilə HƏR İKİ microservice-i EYNİ ANDA işə salır!
    "start:dev-all": "concurrently -c \"cyan.bold,green.bold\" \"npm:start:dev-auth\" \"npm:start:dev-user\"",

    // 4️⃣ Production rejimi üçün dist daxilindəki build-i vurur:
    "start:prod-auth": "node dist/apps/auth-app/main",
    "start:prod-user": "node dist/apps/user-app/main"
  }
}
```

### 💡 `concurrently` Nədir?
Frontend-də eyni anda həm React serverini, həm Backend serverini işə salmaq üçün istifadə etdiyin kimi, monorepo-da da eyni anda 2 müxtəlif NestJS microservice-ini (Port 3001 və Port 3002) tək terminal əmri ilə işlədir!

---

## 📄 2. `nest-cli.json` İzahı (Monorepo Beyni)

`nest-cli.json` NestJS CLI-ya monorepo-da neçə dənə app və lib olduğunu deyən xəritədir:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "monorepo": true, // 👈 NestJS-ə monorepo rejimində olduğunu bildirir
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true
  },
  "projects": {
    // 🔐 1. Auth Tətbiqi:
    "auth-app": {
      "type": "application",
      "root": "apps/auth-app",
      "entryFile": "main",
      "sourceRoot": "apps/auth-app/src"
    },
    // 👤 2. User Tətbiqi:
    "user-app": {
      "type": "application",
      "root": "apps/user-app",
      "entryFile": "main",
      "sourceRoot": "apps/user-app/src"
    },
    // 📦 3. Ortak Kitabxana:
    "external": {
      "type": "library",
      "root": "libs/external",
      "entryFile": "index",
      "sourceRoot": "libs/external/src"
    }
  }
}
```

Bu fayl sayəsində terminalda `nest build user-app` yazanda Nest CLI bilir ki, gedib `apps/user-app` qovluğunu compile etməlidir!

---

## 📄 3. `tsconfig.json` İzahı (TypeScript Path Aliases)

Monorepo-da ən sehrli hissə TypeScript-in `paths` ayarıdır:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      // 👈 Bu sehrli ayar sayəsində import-lar qısa və təmiz olur!
      "@app/external": [
        "libs/external/src"
      ],
      "@app/external/*": [
        "libs/external/src/*"
      ]
    }
  }
}
```

### ✨ Bu bizə nə qazandırır?
Əgər bu ayar olmasaydı, `auth-app` daxilində ortak kitabxananı belə bərbad import etməli idik:
```typescript
// ❌ BƏRBAD & ÇƏTİN İMPORT:
import { ExternalModule } from '../../../libs/external/src/external.module';
```

`paths` sayəsində isə belə qısa və peşəkar yazırıq:
```typescript
// ✅ MÜKƏMMƏL & TƏMİZ İMPORT:
import { ExternalModule } from '@app/external';
```

---

## 📄 4. `.gitignore` İzahı

```text
node_modules
dist
*.log
.env
```
Bu fayl `node_modules` (ağır kitabxanalar) və `dist` (compile olunmuş JS faylları) qovluqlarının GitHub-a yüklənməsinin qarşısını alır.

---

## 🎯 Neticə
Artıq sən Monorepo strukturu tam anladın! Qovluqların daxilindəki kodları araşdıra bilərsən.
