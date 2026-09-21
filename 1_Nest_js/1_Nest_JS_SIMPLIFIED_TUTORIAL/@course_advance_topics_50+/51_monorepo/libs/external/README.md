# 📦 Shared Library (`libs/external`) & `tsconfig.lib.json` İzahı

Salam! Bu qovluq Monorepo daxilindəki **bütün tətbiqlərin (`auth-app`, `user-app`) ORTAK istifadə etdiyi kitabxanadır**.

Burada olan **`tsconfig.lib.json`** faylı bu kitabxananın TypeScript tənzimləməsini edir. 

---

## 📄 `tsconfig.lib.json` Faylının Sətir-Sətir İzahı

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
    "**/*spec.ts"                   // 5️⃣ Test fayllarını və dist-i build-dən kənarda saxla
  ]
}
```

---

### 🔍 Hər Bir Parametrin Dərin Mənası:

1. **`"extends": "../../tsconfig.json"`**:
   - Kitabxana sıfırdan TypeScript ayarları yazmır. Qovluqdan 2 mərtəbə yuxarı çıxaraq ana `tsconfig.json`-da olan bütün parametrləri (Decorator-lar, ES2021 targeti və s.) **miras (inherit) alır**.

2. **`"declaration": true`** *(ÇOX VACİB)*:
   - Bu kitabxana JavaScript-ə çevriləndə yanında **`.d.ts` (TypeScript Type Definition)** faylları yaradır.
   - Bu sayədə `auth-app` və ya `user-app`-də bu kitabxananı import edəndə VS Code sənə avtomatik **Auto-complete (kod tamamlama və tip köməyi)** verir!

3. **`"outDir": "../../dist/libs/external"`**:
   - Kitabxana `nest build` olunanda hazır faylların kökdəki `dist/libs/external` qovluğuna toplanmasını təmin edir.

4. **`"include": ["src/**/*"]`**:
   - Yalnız `libs/external/src/` qovluğundakı kodları compile siyahısına daxil edir.

5. **`"exclude": ["**/*spec.ts"]`**:
   - Test fayllarını (`.spec.ts`) production build-inə qatmır ki, `dist/` qovluğunun həcmi böyüməsin.

---

## 📁 `libs/external` daxilindəki Digər Fayllar:

- **`src/index.ts`**: Kitabxananın **Giriş Qapısıdır (Public API)**. Çöldəki tətbiqlər (`@app/external`) yalnız `index.ts` daxilində `export` olunan modulları və servisləri görə bilər.
- **`src/external.module.ts`**: Ortak moduldur (`exports: [ExternalService]`).
- **`src/external.service.ts`**: Ortak biznes mentiqi (məsələn, ortak DB konfiqurasiyası və ya ümumi funksiyalar).
