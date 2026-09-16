# Short acixlamalar

## CLI Nədir?
**CLI (Command Line Interface)** — terminalda yazdığın qısa əmrlərlə işləyən idarəetmə alətidir.
Faylları qovluq açıb əllə yaratmaq yerinə, terminala 1 sətir əmr yazırsan və sənin üçün lazım olan bütün faylları, şablonları və konfiqurasiyaları avtomatik hazırlayır.

---

## 🪺 NestJS CLI — Bütün Əmrlər Siyahısı

NestJS CLI (`nest`) — bütün backend strukturlarını (Module, Controller, Service, DTO, Entity və təmiz CRUD) 1 saniyədə avtomatik yaradan rəsmi alətdir.

### 1. NestJS CLI İnstalyasiyası (Kompyuterə Quraşdırmaq)
```bash
npm i -g @nestjs/cli
```

### 2. Yeni Bütöv Layihə Yaratmaq (Full Boilerplate)
```bash
nest new project-name
```
*Bu əmr tam hazır proyekt strukturu (`src/`, `main.ts`, `app.module.ts`, `package.json`, git) hazırlayır.*

---

### 3. Komponent Yaradan Əmrlər (`nest generate` və ya `nest g`)

> 💡 **Qeyd:** `g` harfi `generate` sözünün qısaldılmış formasıdır.

| Əmr                        | Nə Yaradır?            | Avtomatik Nə Edir?                                                       |
| :------------------------- | :--------------------- | :----------------------------------------------------------------------- |
| `nest g module user`       | `user.module.ts`       | Modulu yaradır və `app.module.ts`-ə avtomatik `import` edir.             |
| `nest g controller user`   | `user.controller.ts`   | Controller yaradır və `user.module.ts`-in `controllers` massivinə yazır. |
| `nest g service user`      | `user.service.ts`      | Service yaradır və `user.module.ts`-in `providers` massivinə yazır.      |
| `nest g middleware logger` | `logger.middleware.ts` | Sorğuları tutan Middleware faylı yaradır.                                |
| `nest g pipe validation`   | `validation.pipe.ts`   | Datanı doğrulayan Pipe faylı yaradır.                                    |
| `nest g guard auth`        | `auth.guard.ts`        | İcazələri yoxlayan Guard faylı yaradır.                                  |
| `nest g interceptor log`   | `log.interceptor.ts`   | Sorğunu izləyən Interceptor faylı yaradır.                               |
| `nest g filter http`       | `http.filter.ts`       | Xətaları tutan Exception Filter yaradır.                                 |

---

### 4. 🚀 MÖCÜZƏVİ ƏMR: Tam Bütöv CRUD Resursu Yaratmaq (`nest g resource`)

```bash
nest g resource users
```

Bu əmri yazdıqda CLI sənə 2 sual verir:
1. *What transport layer do you use?* -> **REST API** seçirsən.
2. *Would you like to generate CRUD entry points?* -> **y** (yes) basırsan.

**Nəticə:** 1 saniyədə aşağıdakı bütöv CRUD strukturu avtomatik yaradılır:
- `users/users.module.ts`
- `users/users.controller.ts` (bütün `@Get()`, `@Post()`, `@Patch()`, `@Delete()` hazır!)
- `users/users.service.ts` (bütün CRUD funksiyaları hazır!)
- `users/dto/create-user.dto.ts`
- `users/dto/update-user.dto.ts`
- `users/entities/user.entity.ts`
- Unit test faylları (`.spec.ts`)

---

### 5. ⚡ Faydalı CLI Bayraqları (Flags)

* **`--no-spec` (Test faylını yaratmamaq):**
  ```bash
  nest g service user --no-spec
  ```
  *(Yanında `.spec.ts` test faylını yaratmır, kodlar daha təmiz qalır).*

* **`--dry-run` və ya `-d` (Sınaq rejimində yoxlamaq):**
  ```bash
  nest g resource products --dry-run
  ```
  *(Faylları kompyuterə real yazmır, sadəcə nə yaradacağını terminalda sınaq kimi göstərir).*

* **`--flat` (Qovluq açmadan yaratmaq):**
  ```bash
  nest g service user --flat
  ```
  *(Ayrıca `user/` qovluğu açmadan faylı birbaşa olduğu qovluğa atır).*
