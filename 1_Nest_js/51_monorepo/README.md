# 🏢 NestJS Monorepo Architecture (#51)

Salam! **`51_monorepo`** dərsinə xoş gəldin!

Frontend proqramçı olaraq bu dərsi izləyəndə ağzının açıq qalması çox normaldır! Çünki monorepo sadəcə bir app yaratmaq deyil, **böyük şirkətlərin (Google, Facebook, Uber) yüzlərlə microservice və layihəni TƏK BİR REPOZİTORİYADA idarə etmə texnikasıdır**.

Bu sənəddə **Monorepo nədir**, **Polyrepo-dan fərqi nədir**, **`apps/` və `libs/` nə iş görür**, **`package.json` və `nest-cli.json` arxasında nə baş verir** sıfırdan öyrənəcəksən.

---

## ❓ 1. Monorepo Nədir? (Ən Sadə İzah)

### ❌ Köhnə Yanaşma: Polyrepo (Hər Proyektə Ayrı GitHub Repozitoriyası)
Təsəvvür et ki, şirkətdə 3 fərqli backend layihən var:
1. `auth-service` (GitHub repo #1)
2. `user-service` (GitHub repo #2)
3. `payment-service` (GitHub repo #3)

**İsgəncə nə vaxt başlayır?**
Əgər bu 3 proyektin üçündə də eyni Verilənlər Bazası Kodlarını və ya eyni `UserDto`-nu istifadə etmək istəsən:
- Kodları hər 3 proyektdə **Copy-Paste** etməlisən!
- Və ya ayrıca npm paket düzəldib `npm publish` edib hər 3 proyektdə `npm install` etməlisən. 🤯

---

### ✅ Yeni Yanaşma: Monorepo (Tək Repozitoriyada Çoxlu App & Kitabxana)
**Monorepo (Mono Repository)** — **BÜTÜN** proyektləri və **ORTAK KITABXANALARI (Libs)** tək bir GitHub qovluğunda saxlayır!

```text
nestjs-monorepo/          ──► Tək bir kök qovluq!
├── apps/                 ──► Müstəqil işləyən backend tətbiqləri
│   ├── auth-app/         ──► Port 3001-də işləyən Auth servisi
│   └── user-app/         ──► Port 3002-də işləyən User servisi
├── libs/                 ──► Hamısının ORTAK istifadə etdiyi kitabxanalar
│   └── external/         ──► Ortak database/log/config modulu (@app/external)
├── node_modules/         ──► BÜTÜN layihələr üçün TƏK bir node_modules!
├── package.json          ──► Tək package.json
├── nest-cli.json         ──► Monorepo tənzimləmələri
└── tsconfig.json         ──► Ortak TypeScript ayarları və @app/ path-ləri
```

---

## 🚀 2. Monorepo-nun Qızıl Üstünlükləri (Frontend-çinin Gözü İlə)

1. **Ortak `node_modules` (Yaddaşa Qənaət):** 10 fərqli proyekt üçün 10 dəfə `npm install` edib 5 Qiqabayt `node_modules` dolmur. Cəmi **BİR** `node_modules` var!
2. **Kodu Paylaşmaq Çox Asandır (`libs/`):** Bir DTO və ya Baza funksiyası yazdınsa, bunu `libs/external`-ə qoyursan. Həm `auth-app`, həm `user-app` birbaşa `import { ExternalModule } from '@app/external'` yazaraq istifadə edir. `npm publish`-ə ehtiyac yoxdur!
3. **Tək Komanda ilə Hamısını İşlətmək:** `package.json`-da `npm run start:dev-all` yazırsan, `concurrently` vasitəsilə eyni anda həm Auth, həm User microservice-i işə düşür!

---

## 🛠️ 3. NestJS-də Monorepo Əmrləri (CLI)

Gələcəkdə özün sıfırdan monorepo yaratmaq istəsən, Nest CLI bu əmrləri istifadə edir:

### A) Standart Tətbiqi Monorepo-ya Çevirmək:
```bash
# Mövcud NestJS proyektinin daxilində yeni tətbiq yaradanda NestJS soruşur:
# "Monorepo struktura keçək?" -> Yes seçirsən!
nest generate app user-app
```

### B) Ortak Kitabxana (Shared Library) Yaratmaq:
```bash
nest generate library external
# Və ya qısaca:
nest g lib external
```
Bu əmr avtomatik `libs/external` qovluğunu yaradır və `tsconfig.json`-a `@app/external` yolunu (alias) əlavə edir!

---

## 📂 4. Layihədə Yaradılmış Canlı Nümunə Qovluqlar

Biz sənə **`1_Nest_js/51_monorepo`** daxilində **tam işlək NestJS Monorepo sistemi** qurduq:

- 📄 **[apps/auth-app/](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/51_monorepo/apps/auth-app/src/main.ts)** (Port 3001)
- 📄 **[apps/user-app/](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/51_monorepo/apps/user-app/src/main.ts)** (Port 3002)
- 📄 **[libs/external/](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/51_monorepo/libs/external/src/external.service.ts)** (Ortak kitabxana)
- 📄 **[CONFIG_EXPLAINED.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/51_monorepo/CONFIG_EXPLAINED.md)** (`package.json`, `nest-cli.json` və `tsconfig.json`-un xətir-xətir izahı)

---

## 🎯 5. Qızıl Xülasə

1. **Monorepo** = Çoxlu tətbiqlər (`apps/`) + Ortak Kitabxanalar (`libs/`) + Tək `node_modules`.
2. **`libs/`** daxilindəki kodları `npm publish` etmədən `@app/lib-name` adı ilə istifadə edə bilərsən.
3. **`nest-cli.json`** faylında `"monorepo": true` yazılır və hansı app-in harda olduğu göstərilir.
4. `.gitignore` faylı `node_modules` və `dist` qovluqlarını GitHub-a getməkdən qoruyur.
