# 🧪 Test və Build Konfiqurasiya Faylları İzahı

Bu sənəd layihədə yer alan **Jest (Test)** və **TypeScript (Build)** tənzimləmə fayllarını (`jest.config.js`, `jest.config-e2e.js`, `tsconfig.build.json`, `tsconfig.e2e.json`) ətraflı izah edir.

---

## 1. 🧪 Jest və Test Setup Faylları

**Jest** — JavaScript və TypeScript proqramları üçün avtomatlaşdırılmış test freymvorkudur. NestJS-də 2 növ test istifadə olunur: **Unit Test** və **E2E (End-to-End) Test**.

### 🔹 `jest.config.js` (Unit Test Tənzimləməsi)
* **Nədir?**: Tək-tək servislərin və kontrolerlərin daxili funksionallığını izolyasiya olunmuş şəkildə yoxlayan **Vahid (Unit) Test** faylıdır.
* **Nə işə yarayır?**: `src/` daxilindəki `.spec.ts` uzantılı faylları (məsələn `app.controller.spec.ts`) tapır və işə salır.
* **Nə vaxt işlədilir?**: `npm run test` əmrini verdikdə.

### 🔹 `jest.config-e2e.js` (End-to-End Test Tənzimləməsi)
* **Nədir?**: Bütün NestJS serverini virtual olaraq ayağa qaldırıb həqiqi HTTP sorğularını (`GET /users`, `POST /auth/login`) yoxlayan **E2E Test** faylıdır.
* **Nə işə yarayır?**: `test/` qovluğundakı `.e2e-spec.ts` fayllarını işə salır. Sorğunun bazadan cavab qaytarıb-qaytarmadığını başdan-sona sınaqdan keçirir.
* **Nə vaxt işlədilir?**: `npm run test:e2e` əmrini verdikdə.

---

## 2. 🛠️ TypeScript Build və Test Konfiqurasiya Faylları

### 🔹 `tsconfig.build.json` (Production Build Tənzimləməsi)
* **Nədir?**: Layihəni istehsalat (Production) üçün JavaScript-ə çevirən (`npm run build`) TypeScript konfiqurasiyasıdır.
* **Nə işə yarayır?**: 
  - `tsconfig.json` faylından miras alır (`extends`).
  - `src/` daxilindəki əsas kodları `dist/` papakasına compile edir.
  - Test fayllarını (`*.spec.ts`) və `test/` qovluğunu **istehsalat koduna qoşmur (`exclude`)**, beləliklə `dist/` qovluğu kiçik və təmiz qalır.

### 🔹 `tsconfig.e2e.json` (E2E Test TypeScript Tənzimləməsi)
* **Nədir?**: E2E test faylları üçün xüsusi TypeScript konfiqurasiyasıdır.
* **Nə işə yarayır?**: `test/` qovluğundakı test fayllarının TypeScript tiplərini, `supertest` və `jest` kitabxanalarını maneəsiz tanımasını təmin edir.
