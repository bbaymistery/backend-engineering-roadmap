# ⚙️ CI/CD, Node Versiya və Prettier Konfiqurasiya Faylları İzahı

Bu sənəd layihənizdə yer alan **`.gitlab-ci.yml`**, **`.nvmrc`** və **`.prettierignore`** fayllarının nə olduğunu və neçün istifadə edildiyini ətraflı izah edir.

---

## 1. 🚀 `.gitlab-ci.yml` (GitLab CI/CD Konfiqurasiyası)

* **Nədir?**: **GitLab CI/CD** (Continuous Integration / Continuous Deployment - Davamlı İnteqrasiya və Daşınma) alətinin konfiqurasiya faylıdır.
* **Nə işə yarayır?**: Siz kodu GitLab deposuna göndərdikdə (`git push`), GitLab serverləri avtomatik olaraq:
  1. `npm install` edib kitabxanaları yükləyir.
  2. `npm run lint` edib kod səhvlərini yoxlayır.
  3. `npm run test` edib testləri işə salır.
  4. Hər şey uğurlu keçərsə, kodu avtomatik olaraq serverə (Production) yerləşdirir (Deploy edir).

---

## 2. 🟢 `.nvmrc` (Node.js Versiya Tənzimləyicisi)

* **Nədir?**: **NVM (Node Version Manager)** aləti üçün təyin edilmiş Node.js versiya faylıdır.
* **Nə işə yarayır?**: Layihənin tam olaraq hansı Node.js versiyasında (məsələn `20.11.0` və ya `20`) işləməli olduğunu göstərir.
* **Faydası**: Komandada işləyən proqramçılar öz terminalında `nvm use` əmrini verdikdə, sistem avtomatik olaraq layihəyə uyğun düzgün Node.js versiyasına keçir. Versiya fərqliliyi ucbatından yaranan xətaların qarşısını alır.

---

## 3. 🎨 `.prettierignore` (Kod Formatlama İstisnaları)

* **Nədir?**: **Prettier** (avtomatik kod səliqəyəsalma aləti) üçün istisna faylıdır.
* **Nə işə yarayır?**: Prettier-ə hansı qovluq və fayllara **DƏYMƏMƏLİ** olduğunu bildirir.
* **Nümunə**:
  ```text
  dist/
  node_modules/
  coverage/
  package-lock.json
  ```
  Auto-compile olunmuş (`dist/`) və ya hazır kitabxana (`node_modules/`) fayllarını Prettier tərəfindən formatlanmaqdan qoruyur, beləliklə build prosesi sürətlənir.
