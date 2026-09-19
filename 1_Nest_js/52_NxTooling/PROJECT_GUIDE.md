# 📘 Layihənin Daxili İşləmə Mexanizmi (PROJECT_GUIDE)

Salam! Bu sənəddə `52_NxTooling` layihəsindəki **`packages/shared-dto`** və **`apps/`** arasındakı canlı kod əlaqəsini öyrənəcəksən.

---

## 📦 1. Shared DTO (`packages/shared-dto`) Necə Paylaşılır?

`packages/shared-dto/src/user.dto.ts` daxilində ümumi DTO təyin etmişik:

```typescript
export class CreateUserDto {
  name: string;
  email: string;
  role: string;
}
```

Root `tsconfig.json`-da olan alias sayəsində:
```json
"paths": {
  "@packages/shared-dto": ["packages/shared-dto/src"]
}
```

Həm `nestjs-advance-auth-app-02` (Port 4001), həm də `nestjs-advance-dto-01` (Port 4002) bu DTO-nu birbaşa belə import edir:

```typescript
import { CreateUserDto } from '@packages/shared-dto';
```

---

## 🐶 2. Husky Pre-commit İzləyicisi Necə İdarə Olunur?

`.husky/pre-commit` faylı:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🐶 Husky: Running Pre-commit checks (Lint & Prettier)..."
pnpm run lint
```

Bu sayədə kimsə layihədə `git commit` vuranda Husky avtomatik bütün `apps/` və `packages/` kodlarını ESLint və Prettier ilə yoxlayır. Səhv varsa, commit baş tutmur!

---

## 🎯 Neticə
Bu layihə sənə real iş mühitlərində istifadə olunan monorepo, shared packages, husky və nx tooling mexanikasını 100% praktiki göstərir.
