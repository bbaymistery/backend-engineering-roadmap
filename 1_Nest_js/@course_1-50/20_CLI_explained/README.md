# 🛠️ NestJS CLI Explained | Create & Structure Apps the Right Way (Dərs #20)

Salam! Əziz tələbəm, NestJS öyrənmə yolunda sənin işini **10 dəfə sürətləndirəcək və asanlaşdıracaq** ən möhtəşəm mövzuya — **NestJS CLI (Command Line Interface)** mövzusuna gəldik! 🚀

---

## ❓ 1. NestJS CLI Nədir? Məgər Bize Boilerplate Hazırlayan Əmrlər Var?

**BƏLİ, TAMAMİLƏ DOĞRUDUR!**

Şəkillərdə gördüyün əmrlər sırf buna xidmət edir. Ənənəvi olaraq bir modul yaradanda sən:
1. Qovluq açmalısan (`mkdir user`).
2. `user.controller.ts` faylı yaradıb `@Controller('user')` yazmalısan.
3. `user.service.ts` faylı yaradıb `@Injectable()` yazmalısan.
4. `user.module.ts` faylı yaradıb onları əllə `controllers: [...]` və `providers: [...]` massivinə import etməlisən.

**NestJS CLI ilə isə bu 4 addımı terminala sadəcə 1 sətir əmr yazaraq 1 saniyədə edirsən!** CLI həm faylları yaradır, həm daxilindəki hazır şablon kodları (boilerplate) yazır, həm də modulda avtomatik qeydiyyatdan keçirir.

---

## 💡 2. Boilerplate Nədir?
**Boilerplate** — Hər dəfə yeni bir servis və ya modul yaradanda təkrar-təkrar yazmağa məcbur olduğumuz standart təməl koddur. NestJS CLI bu təkrarçılığı bizim yerimizə avtomatik edir.

---

## 📸 3. Şəkillərdə Gördüyün Əmrlərin İzahı

Şəkillərdə gördüyün terminal əmrlərinin hər biri nə iş görür:

1. **`nest g controller appController`**
   * `g` = `generate` deməkdir.
   * `appController` adlı yeni bir Controller faylı yaradır və onu modulda `controllers: [...]` daxilinə avtomatik qeyd edir.

2. **`nest g service appService`**
   * `appService` adlı yeni bir Service faylı yaradır və onu modulda `providers: [...]` daxilinə avtomatik qeyd edir.

3. **`nest g middleware appService`**
   * HTTP sorğularını izləyən yeni bir Middleware faylı yaradır.

4. **`mkdir auth-module`**
   * Bu standart terminal əmridir (`mkdir` = make directory), yeni `auth-module` qovluğu açır.

5. **`nest g resource user-module` (Şəkil 5-dəki möcüzə!)**
   * Bütöv **CRUD strukturunu** (DTO-lar, Entity, Controller, Service və Module) tək bir əmrlə avtomatik generasiya edir!

---

## 📋 4. Bütün NestJS CLI Əmrlərinin Tam Siyahısı (Cheatsheet)

### 1️⃣ Yeni Layihə Başlatmaq
```bash
nest new my-nest-app
```
*Bu əmr bütöv NestJS proyektini (`src/`, `main.ts`, `package.json`, `tsconfig.json`, `git`) hazırlayır.*

---

### 2️⃣ Tək-Tək Komponentlər Yaratmaq (`nest g <type> <name>`)

```bash
# 📦 Modul yaratmaq:
nest g module users

# 🎮 Controller yaratmaq:
nest g controller users

# ⚙️ Service yaratmaq:
nest g service users

# 🛡️ Guard (Auth üçün) yaratmaq:
nest g guard auth

# 🔄 Pipe (Validation üçün) yaratmaq:
nest g pipe validation

# ⚡ Interceptor yaratmaq:
nest g interceptor logging

# 🚨 Exception Filter yaratmaq:
nest g filter http-exception

# 🔍 Middleware yaratmaq:
nest g middleware logger
```

---

### 3️⃣ 🚀 ən Güclü Əmr: `nest g resource <name>`

Təsəvvür et ki, e-ticarət saytında `products` bölməsi yaradırsan. Terminala sadəcə bunu yazırsan:

```bash
nest g resource products
```

CLI terminalda sənə soruşur:
1. `What transport layer do you use?` -> **REST API** seçirsən.
2. `Would you like to generate CRUD entry points?` -> **y** (yes) basırsan.

**1 saniyədə aşağıdakı qovluq və fayllar avtomatik yaranır:**
```text
src/products/
├── dto/
│   ├── create-product.dto.ts   # DTO faylı
│   └── update-product.dto.ts   # DTO faylı
├── entities/
│   └── product.entity.ts       # Entity faylı
├── products.controller.ts      # Bütün @Get, @Post, @Patch, @Delete hazır!
├── products.module.ts          # Modul qeydiyyatı hazır!
├── products.service.ts         # Bütün CRUD metodları hazır!
└── products.service.spec.ts    # Test faylı
```

---

## ⚡ 5. Çox İstifadə Olunan Bayraqlar (Flags & Options)

CLI əmrlərinin sonuna xüsusi hissəciklər əlavə edərək onların davranışını dəyişə bilərik:

* **`--no-spec` (Test fayllarını yaratmamaq):**
  Defolt olaraq CLI hər faylın yanında `.spec.ts` (unit test) faylı yaradır. Əgər test faylı istəmirsənsə:
  ```bash
  nest g service users --no-spec
  ```

* **`--dry-run` və ya `-d` (Sınaq rejimi):**
  Əmrin faylları real yaratmadan terminalda nə edəcəyini öncədən görmək üçün:
  ```bash
  nest g resource orders --dry-run
  ```

* **`--flat` (Ayrıca qovluq açmadan yaratmaq):**
  ```bash
  nest g service users --flat
  ```

---

## 🎯 Yekun Özet (Xülasə)

1. NestJS CLI sənə faylları əllə yaratmaq əziyyətindən xilas edir.
2. `nest g module name`, `nest g controller name`, `nest g service name` əmrləri faylları yaradır və modula avtomatik bağlayır.
3. `nest g resource name` əmri bütöv 1 layihəlik CRUD strukturunu DTO və Entity ilə birgə 1 saniyədə hazır edir.
4. Bütün bu əmrlərin siyahısını kök qovluqdakı **[commands.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/commands.md)** faylına da əlavə etdik!
