# ⚙️ Monorepo Konfiqurasiya Fayllarının Dərin İzahı

Salam! Bu sənəddə **Monorepo** layihəsindəki konfiqurasiya fayllarını (`package.json`, `nest-cli.json`, `tsconfig.json`) sətir-sətir öyrənəcəksən.

---

## 📄 1. `package.json` İzahı (Bütün Skriptlərin Təfərrüatlı Şərhi)

Monorepo-da cəmi **BİR DƏNƏ** ana `package.json` olur. `scripts` daxilindəki hər bir əmrin sənə nə iş gördüyünü sətir-sətir izah edirəm:

```json
"scripts": {
  "build": "nest build",
  "format": "prettier --write \"apps/**/*.ts\" \"libs/**/*.ts\"",
  "start": "nest start",
  "start:dev-auth": "nest start --watch auth-app",
  "start:dev-user": "nest start --watch user-app",
  "start:dev-all": "concurrently -c \"cyan.bold,green.bold\" \"npm:start:dev-auth\" \"npm:start:dev-user\"",
  "start:debug": "nest start --debug --watch",
  "start:prod-auth": "node dist/apps/auth-app/main",
  "start:prod-user": "node dist/apps/user-app/main",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "test": "jest"
}
```

---

### 🔍 Hər Bir Skriptin Sətir-Sətir Dərin İzahı:

#### 1. `"build": "nest build"`
- **Nə edir?** Monorepo-da olan **BÜTÜN tətbiqləri** (`apps/auth-app` və `apps/user-app`) və `libs/` qovluqlarını compile edib `dist/` qovluğuna JavaScript-ə çevirir.
- **🤔 2 dənə tətbiqi necə Production-a hazırlayır? Hansı çalışacaq?**
  - `nest build` edəndə `dist/` daxilində 2 ayrı JavaScript qovluğu yaranır: `dist/apps/auth-app/main.js` və `dist/apps/user-app/main.js`.
  - Production serverində (və ya Docker-də) bunlar **MÜSTƏQİL 2 AYRI PROCESS** kimi çalışır!
  - Server 1-də Auth-u başladırıq: `node dist/apps/auth-app/main` (Port 3001)
  - Server 2-də User-i başladırıq: `node dist/apps/user-app/main` (Port 3002)
  - Yəni build hər ikisini hazırlayır, amma production-da istədiyin microservice-i müstəqil işə salırsan!

#### 2. `"format": "prettier --write \"apps/**/*.ts\" \"libs/**/*.ts\""`
- **Nə edir?** Prettier vasitəsilə `apps` və `libs` daxilindəki bütün TypeScript fayllarının kod formatını avtomatik səliqəyə salır.

#### 3. `"start": "nest start"`
- **Nə edir?** Standart olaraq `nest-cli.json`-da təyin olunmuş **Defolt Tətbiqi (`defaultProject`)** işə salır.
- **🤔 Hansı tətbiq işləyəcək?**
  - Bizim layihədə `nest-cli.json`-da kök tətbiq olaraq `auth-app` göstərildiyi üçün `nest start` yazanda avtomatik **`auth-app`** (Port 3001) işə düşür!
  - Əgər konkrət `user-app`-i işlətmək istəsən: `nest start user-app` (və ya `npm run start:dev-user`) yazmalısan.

#### 4. `"start:dev-auth": "nest start --watch auth-app"`
- **Nə edir?** Yalnız **Auth App** microservice-ini (Port 3001) Development rejimində işə salır. `--watch` bayrağı sayəsində kodda hər hansı dəyişiklik edib `Ctrl + S` basanda server avtomatik özünü yeniləyir (Hot Reload)!

#### 5. `"start:dev-user": "nest start --watch user-app"`
- **Nə edir?** Yalnız **User App** microservice-ini (Port 3002) Development rejimində `--watch` ilə canlı işə salır.

#### 6. `"start:dev-all": "concurrently -c \"cyan.bold,green.bold\" \"npm:start:dev-auth\" \"npm:start:dev-user\""`
- **Nə edir?** `concurrently` paketi vasitəsilə **həm Auth App, həm User App-i EYNİ ANDA TƏK TERMINALDA** işə salır! `-c "cyan.bold,green.bold"` hissəsi terminalda Auth-un loqlarını Mavi (Cyan), User-in loqlarını Yaşıl (Green) rəngdə göstərir ki, bir-birinə qarışmasın!

#### 7. `"start:debug": "nest start --debug --watch"`
- **Nə edir?** Tətbiqi Debug rejimində açır. VS Code və ya Chrome DevTools vasitəsilə koddakı Breakpoint-ləri (dayanma nöqtələrini) tutub addım-addım xətaları (bug) tapmaq üçündür.

#### 8. `"start:prod-auth": "node dist/apps/auth-app/main"`
- **Nə edir?** Production serverində `build` olub `dist/` qovluğuna düşmüş hazır JavaScript faylını (`dist/apps/auth-app/main.js`) `node` vasitəsilə ən yüksək sürətlə işə salır.

#### 9. `"start:prod-user": "node dist/apps/user-app/main"`
- **Nə edir?** Production serverində `dist/apps/user-app/main.js` hazır JavaScript tətbiqini işə salır.

#### 10. `"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"`
- **Nə edir?** ESLint vasitəsilə koddakı səhvləri, istifadə olunmayan dəyişənləri və qayda pozuntularını yoxlayır. `--fix` parametri tapdığı kiçik xətaları özü avtomatik düzəldir.

#### 11. `"test": "jest"`
- **Nə edir?** Jest test çərçivəsini (testing framework) işə salaraq layihədəki bütün `.spec.ts` (unit test) fayllarını avtomatik icra edir və testlərin keçib-keçmədiyini yoxlayır.

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

## 📄 4. Kitabxanalardakı `tsconfig.lib.json` Faylının İzahı

`libs/external/tsconfig.lib.json` faylı shared library-nin TypeScript tənzimləməsini edir:

```json
{
  "extends": "../../tsconfig.json", // 1️⃣ Qlobal tsconfig-dən miras alır
  "compilerOptions": {
    "declaration": true,            // 2️⃣ Type definition (.d.ts) faylları yaradır
    "outDir": "../../dist/libs/external" // 3️⃣ Compile olunan faylların düşəcəyi yer
  },
  "include": [
    "src/**/*"                      // 4️⃣ Yalnız src/ daxilindəki faylları compile et
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*spec.ts"                   // 5️⃣ Test fayllarını build-dən kənarda saxla
  ]
}
```

### ✨ `tsconfig.lib.json`-un 2 Qızıl Məqamı:
1. **`"extends": "../../tsconfig.json"`**: Qovluqdan 2 mərtəbə yuxarı çıxaraq ana `tsconfig.json`-da olan bütün parametrləri (Decorators, ES2021 targeti və s.) miras alır.
2. **`"declaration": true`**: Kitabxana üçün **`.d.ts` (Type Definition)** faylları yaradır. Bu sayədə `auth-app` və `user-app`-də bu kitabxananı import edəndə VS Code sənə avtomatik **Auto-complete (kod tamamlama və tip köməyi)** verir!

---

## 📄 5. `.gitignore` İzahı

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
