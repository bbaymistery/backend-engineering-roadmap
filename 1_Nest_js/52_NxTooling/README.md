# ⚡ Nx Tooling, PNPM Workspaces & Husky Git Hooks (#52)

Salam! **`52_NxTooling`** dərsinə xoş gəldin!

Sənin üçün **şəkildəki arxitekturanın EYNİSİNİ** bu papqada canlı, öyrədici layihə olaraq qurduq! 

Bu sənəddə **Nx Tooling**, **PNPM Workspaces**, **Husky (Git Hooks)** və **Commitlint** alətlərinin necə birgə işlədiyini sıfırdan öyrənəcəksən.

---

## 📂 Layihənin Qovluq Strukturu (Şəkildəki Kimi)

```text
1_Nest_js/52_NxTooling/
├── .husky/                         ──► 🐶 Git commit-lərə nəzarət edən Husky keçikçisi
│   ├── pre-commit                  ──► Commit-dən əvvəl lint & prettier yoxlayır
│   └── commit-msg                  ──► Commit mesajının formatını (commitlint) yoxlayır
├── apps/                           ──► 🚀 Müstəqil backend tətbiqləri
│   ├── nestjs-advance-auth-app-02/ ──► Port 4001-də işləyən Auth servisi
│   └── nestjs-advance-dto-01/      ──► Port 4002-də işləyən DTO Validation servisi
├── packages/                       ──► 📦 Ortak DTO və kitabxanalar
│   └── shared-dto/                 ──► Hər iki app-in işlətdiyi CreateUserDto (@packages/shared-dto)
├── commitlint.config.js            ──► Commit mesajı qaydaları (feat, fix, docs və s.)
├── pnpm-workspace.yaml             ──► PNPM monorepo qovluq xəritəsi
├── nx.json                         ──► Nx Ağıllı Keşləmə (Caching) tənzimləməsi
├── package.json                    ──► Ana package.json və build skriptləri
└── tsconfig.json                   ──► @packages/shared-dto alias yolları
```

---

## ⚡ 1. Nx Tooling Nədir və Niyə Lazımdır?

- **Monorepo** ──► Bir arxitektura anlayışıdır (Çoxlu app və lib-i tək papqada saxlamaq).
- **Nx** ──► Monorepo-nu **idarə etmək, sürətləndirmək və idarə olunmasını asanlaşdırmaq üçün GÜCLÜ MƏHRƏK (Build System Tool)**.

### 🚀 Nx-in Ağıllı Keşləməsi (Caching - `nx.json`):
```json
{
  "targetDefaults": {
    "build": {
      "cache": true
    }
  }
}
```
Sən `nx build` vuranda Nx layihədə heç nəyin dəyişmədiyini görərsə, tətbiqi 0.01 saniyəyə **keşdən (Cache)** gətirir. Layihədə 50 microservice olsa belə, yalnız dəyişən faylları build edir!

---

## 📦 2. `pnpm-workspace.yaml` Nədir?

Monorepo-da paket idarəçisi olaraq `npm` əvəzinə daha sürətli olan **`pnpm`** istifadə edilir.

`pnpm-workspace.yaml` faylı pnpm-ə monorepo-dakı qovluqların yerini bildirir:
```yaml
packages:
  - 'apps/*'     # apps/ daxilindəki bütün tətbiqlər
  - 'packages/*' # packages/ daxilindəki bütün ortak DTO-lar
  - '!**/test/**' # test qovluqlarını kənarda saxla
```

---

## 🐶 3. Husky & Commitlint (Git Keşikçisi)

Videoda gördüyün **Husky** — `git commit` vuranda kodu avtomatik yoxlayan keşikçidir.

### 🛡️ 1. `pre-commit` Hook (`.husky/pre-commit`):
Sən `git commit -m "..."` yazanda Husky dayanır və arxaplanda `pnpm run lint` işlədir. Kodda sintaksis xətası varsa, **COMMIT OLUNMAĞA İCAZƏ VERMİR!**

### 📝 2. `commit-msg` Hook & `commitlint.config.js`:
Husky commit mesajının standartlara uyğun yazılıb-yazılmadığını yoxlayır:
- ❌ **YALNIŞ:** `git commit -m "kod daxil edildi"` (Husky rədd edir!)
- ✅ **DÜZGÜN:** `git commit -m "feat: add user login DTO"` (Husky qəbul edir!)

---

## 🛠️ 4. Skriptlər və İstifadə Əmrləri (`package.json`)

```bash
# 🏗️ Bütün tətbiqləri VƏ packages-ləri paralell olaraq build etmək:
pnpm run build-all

# 🐶 Husky Git hook-larını aktivləşdirmək:
pnpm run prepare

# 🔐 Auth App-i işlətmək (Port 4001):
pnpm run start:auth

# 📋 DTO Validation App-i işlətmək (Port 4002):
pnpm run start:dto
```

---

## 📄 Əlaqədar Sənədlər:
- 👉 **[PROJECT_GUIDE.md](file:///c:/Users/User/Desktop/backend-roadmap-enginering/1_Nest_js/52_NxTooling/PROJECT_GUIDE.md)** (Daha təfərrüatlı texniki bələdçi)
