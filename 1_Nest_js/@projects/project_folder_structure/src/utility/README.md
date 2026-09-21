# 🛠️ Utility Qovluğu (`src/utility`)

### Nə üçün istifadə olunur?
Bu qovluqda NestJS freymvorkundan müstəqil olan, saf (pure) TypeScript/JavaScript köməkçi funksiyaları saxlanılır.

### Xüsusiyyəti:
- NestJS dependency injection (`@Injectable()`) istifadə ETMİR.
- Sadə `export function` funksiyalarından ibarətdir.
- Hər hansı bir servisdə və ya kontrolerdə dərhal `import` edilib çağırıla bilər.

### Nümunə Fayllar:
- **`date.utility.ts`**: Tarixləri müəyyən formata gətirir.
- **`string.utility.ts`**: Mətnlərin baş hərfini böyüdür.
