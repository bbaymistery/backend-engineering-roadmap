# ⚙️ Core Qovluğu (`src/core`)

### Nə üçün istifadə olunur?
Bütün tətbiq səviyyəsində təkrar istifadə olunan arquitektura komponentləri burada yerləşir:

### Nümunə Fayllar:
- **`guards/auth.guard.ts`**: İstək (Request) gəldikdə istifadəçinin icazəsi olub-olmadığını yoxlayan **Guard**.
- **`interceptors/logging.interceptor.ts`**: İstəyin nə qədər vaxta icra olunduğunu ölçən **Interceptor**.
- **Filters**: Qlobal xətaları tutub nizama salan Exception Filter-lər.
- **Pipes**: Gələn dataları doğrulayan və ya çevirən Pipe-lar.
