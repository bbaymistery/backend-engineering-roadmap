# 👤 User Qovluğu (`src/user`)

### Nə üçün istifadə olunur?
İstifadəçilərlə bağlı olan bütün funksionallıqlar (CRUD: Get, Create, Update, Delete) bu modulda toplanıb.

### Faylların İzahı:
- **`user.controller.ts`**: HTTP sorğularını qarşılayır (`GET /users`, `POST /users`).
- **`user.service.ts`**: Məntiqi icra edir, `DatabaseService`-ə müraciət edir.
- **`user.module.ts`**: İstifadəçi modulunun paketlənməsidir.
- **`dto/create-user.dto.ts`**: İstifadəçi yaradılarkən göndərilən datanın tiplərini müəyyən edir.
