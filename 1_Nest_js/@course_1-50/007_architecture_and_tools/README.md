# 📘 007 - NestJS Əsas Arxitektura Komponentləri və Layihə Alətləri

Bu sənəd NestJS freymvorkunun 4 əsas sütununu (Pipes, Guards, Interceptors, Filters) və layihələrdə istifadə olunan Git/Docker alətlərini (Husky, Commitlint, Docker Compose) ətraflı izah edir.

---

## 1. ⚙️ NestJS-in Əsas Arxitektura Komponentləri

NestJS-də istifadəçi sorğu (Request) göndərdikdə, həmin sorğu Kontrolerə (Controller) çatana qədər 4 əsas yoxlanış təbəqəsindən keçir:

```text
Sorğu (Request) ➡️ [ Pipes ] ➡️ [ Guards ] ➡️ [ Interceptors ] ➡️ Controller ➡️ [ Filters ] ➡️ Cavab (Response)
```

### 🔹 1. Pipes (Borular / Data Doğrulayıcılar)
* **Nədir?**: Daxil olan datanı **təmizləyən və ya doğrulayan (Validation)** mexanizmdir.
* **Nəyə gərək var?**: Məsələn, istifadəçi ID hissəsinə rəqəm əvəzinə `"abc"` göndərərsə, `ParseIntPipe` bunu Kontrolerə çatmadan saxlayır və `"ID rəqəm olmalıdır"` xətası verir.
* **NestJS ilə əlaqəsi**: Kontrolerin daxilinə xarab/səhv məlumatların girməsinin qarşısını alır.

### 🔹 2. Guards (Qoruyucular / İcazə Yoxlayanlar)
* **Nədir?**: İstək göndərən şəxsin **sistemə daxil olub-olmadığını və ya icazəsinin çatdığını (Authorization)** yoxlayır.
* **Nəyə gərək var?**: Məsələn, istifadəçi admin paneline girmək istəyirsə: `"Bu şəxs admindirmi?"` -> Bəli (keçsin), Xeyr (401 Unauthorized xətası verilsin).
* **NestJS ilə əlaqəsi**: NestJS-də `@UseGuards(AuthGuard)` yazaraq istənilən səhifəni qoruya bilirsiniz.

### 🔹 3. Interceptors (Gözətçilər / Arada Tutucular)
* **Nədir?**: Sorğu icra olunmazdan **ƏVVƏL** və icra olunduqdan **SONRA** araya girərək koda əlavə məntiq qoşur.
* **Nəyə gərək var?**: 
  1. Sorğunun neçə millisaniyəyə icra olunduğunu ölçmək (Logging).
  2. Gələn cavabın strukturunu dəyişmək.
* **NestJS ilə əlaqəsi**: RxJS texnologiyasından istifadə edərək NestJS cavablarını izləyir.

### 🔹 4. Exception Filters (Xəta Filtrləri)
* **Nədir?**: Proqramın hər hansı bir yerində xəta (Error) baş verdikdə onu tutan və nizama salan mexanizmdir.
* **Nəyə gərək var?**: Baza çöksə və ya kod xətası olsa, istifadəçiyə qorxulu proqramçı xətaları əvəzinə səliqəli JSON xətası qaytarır:
  ```json
  { "statusCode": 404, "message": "İstifadəçi tapılmadı" }
  ```

---

## 2. 🛠️ Layihədə İstifadə Olunan Avtomatlaşdırma Alətləri

### 🐶 1. Husky (`.husky/` — `pre-commit`, `commit-msg`, `prepare-commit-msg`)
* **Nədir?**: Layihənizdə **Git** istifadə edərkən kodu xətalardan qoruyan avtomatik **"Keşikçi İt" (Git Hooks)** alətidir.
* **Nəyə gərək var?**: Siz terminalda `git commit -m "mesaj"` yazdığınız anda, Husky araya girir və avtomatik olaraq:
  1. Kodda sintaksis xətalarının olub-olmadığını yoxlayır (`lint`).
  2. Kodun səliqəli yazıldığını yoxlayır (`prettier`).
  3. Avtomatik testləri işə salır.
* **Qovluqdakı Fayllar**:
  - 📝 **`pre-commit`**: Commit edilməzdən **əvvəl** kodu yoxlayır. Kod xətalıdırsa commit-i rədd edir.
  - ✉️ **`commit-msg`**: Commit mesajının düzgün formatda yazıldığını yoxlayır.
  - 🔧 **`prepare-commit-msg`**: Commit mesajı şablonlarını hazırlayır.

### 📝 2. `commitlint.config.js`
* **Nədir?**: Git commit mesajlarını yoxlayan kitabxanadır.
* **Nəyə gərək var?**: Commit mesajlarının standart olmasını təmin edir. Məsələn, `git commit -m "feat: add user logic"` formatında yazmağı məcbur edir, `"a"`, `"test"` kimi səliqəsiz mesajlar yazmağa qoymur.

### 🐳 3. `docker-compose.override.yml`
* **Nədir?**: **Docker** konfiqurasiya faylıdır.
* **Nəyə gərək var?**: Kompüterinizdə PostgreSQL, Redis və s. verilənlər bazasını əllə quraşdırmadan, tək bir əmrlə konteyner daxilində başladılması üçün istifadə olunur.
