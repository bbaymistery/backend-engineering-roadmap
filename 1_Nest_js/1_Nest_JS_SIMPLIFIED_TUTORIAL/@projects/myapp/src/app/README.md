# 🏢 App Qovluğu (`src/app`)

### Nə üçün istifadə olunur?
Bütün tətbiqin **Kök (Root) Modulu** burada yerləşir. Digər bütün modullar (`UserModule`, `AuthModule`, `DatabaseModule` və s.) bu qovluqdakı `AppModule`-a qoşulur.

### Faylların İzahı:
- **`app.module.ts`**: Bütün modulları özündə birləşdirən əsas modul.
- **`app.controller.ts`**: Ana səhifə HTTP sorğusunu qarşılayan kontroler (`GET /`).
- **`app.service.ts`**: Ana səhifə üçün xoş gəldiniz mesajını qaytaran servis.
- **`app.controller.spec.ts`**: Avtomatik test yazmaq üçün fayl.
