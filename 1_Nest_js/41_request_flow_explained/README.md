# 🔄 NestJS: Request Lifecycle & Flow Explained (#41)

Salam! **`41_request_flow_explained`** dərsinə xoş gəldin!

Bu sənəddə **`1.png`** şəklindəki NestJS-in **Sorğu İcra Dövriyyəsini (Request Lifecycle)** — bir sorğunun brauzerdən çıxıb serverə çatması, bütöv filtrlərdən keçməsi və geriyə cavab (Response) və ya xəta (Exception) kimi qayıtması addımlarını sıfırdan öyrənəcəksən.

---

## 🗺️ 1. NestJS Sorğu Axını Sxemi (1.png Analizi)

İstifadəçi düyməni basdıqda sorğu aşağıdakı ardıcıllıqla hərəkət edir:

```text
 ┌──────────┐                                                                              
 │  Client  │ ── (Request) ──► 1. Middleware ──► 2. Guard ──► 3. Interceptor (Pre) ──► 4. Pipe
 └────▲─────┘                                                                              │
      │                                                                                    ▼
      │                                                                            5. App Module
      │                                                                         (Controller / Service)
      │                                                                                    │
      │                             ┌──────────────────────────────────────────────────────┴──────────────┐
      │                      SUCCESS (Response)                                                      ERROR (Exception)
      │                             │                                                                     │
      │                             ▼                                                                     ▼
      └────────────── (Response) ── 6. Interceptor (Post) ◄────── (Exception) ── 7. Exception Filter ◄─── 6. Interceptor (Post)
```

---

## 🔍 2. 7 Əsas Addımın Ətraflı İzahı

Gəl `1.png` şəklindəki hər bir addımın nə iş gördüyünü real həyati analogiya ilə addım-addım anlayaq:

---

### 1️⃣ Middleware (Daxil Olan İlk Süzgəc)
- **Rolu:** HTTP sorğusunu ilk qarşılayan aşağı səviyyəli (Express / Fastify) qatdır.
- **Vəzifəsi:** Request Body-ni pars etmək, Cookie-ləri oxumaq, CORS təhlükəsizliyini yoxlamaq, `req` obyektinə ümumi parametrlər artırmaq.
- **Həyati Analogiya:** Binanın xaricindəki **Nəzarət Keçid Məntəqəsi (KPP)** — hər kəsin çantasını Rentgen aparatından keçirir.

---

### 2️⃣ Guard (Qapıçı / Giriş Səlahiyyəti)
- **Rolu:** **Authentication** (Sən kimsən?) və **Authorization** (Bura girməyə icazən var?) yoxlamasını aparır.
- **Vəzifəsi:** JWT Token-i yoxlayır (`JwtAuthGuard`) və istifadəçinin rolunu müqayisə edir (`RolesGuard`).
- **Nəticə:** Əgər `canActivate()` `false` qaytararsa, sorğu **Controller-ə çatmadan** dərhal `401 Unauthorized` və ya `403 Forbidden` xətası ilə dayanır!
- **Həyati Analogiya:** Otağın qapısındakı **Mühafizəçi** — şəxsiyyət vəsiqənizə və dəvətnamənizə baxıb qapını açır.

---

### 3️⃣ Interceptor - Pre Controller (İcradan Əvvəlki Qat)
- **Rolu:** Controller metodunun icrasından əvvəl sorğunu tutan qatdır.
- **Vəzifəsi:** Sorğunun icra vaxtını ölçmək üçün taymeri başladır (`Date.now()`), keçid log-larını yazır.
- **Həyati Analogiya:** İclas otağına girəndə katibənin giriş saatını dəftərə qeyd etməsi.

---

### 4️⃣ Pipe (Data Validasiyası və Çevrilməsi)
- **Rolu:** Controller-in parametr hissəsində işləyən filtrdir.
- **Vəzifəsi:** 
  1. **Validation:** Gələn DTO-da `@IsEmail()`, `@MinLength()` kimi şərtləri yoxlayır (səhv olsa `400 Bad Request` verir).
  2. **Transformation:** URL-dən string kimi gələn `"25"` dəyərini `number` tipinə çevirir (`ParseIntPipe`).
- **Həyati Analogiya:** Məhsulu qablaşdırmazdan əvvəl keyfiyyətini yoxlayan və formasını düzəldən **Tərəzi / Keyfiyyət Süzgəci**.

---

### 5️⃣ App Module (Controller & Service - Biznes Məntiqi)
- **Rolu:** Bütün filtrlərdən təmiz çıxmış datanın emal olunduğu əsas mərkəzdir.
- **Vəzifəsi:** Controller sorğunu qəbul edir, Service Verilənlər Bazası (Database) ilə danışır, bizness məntiqini icra edir və neticə qaytarır.
- **Həyati Analogiya:** Bütün sənədləri yoxlanılmış müştərinin müdirin masası arxasında xidmət alması.

---

### 6️⃣ Interceptor - Post Controller (İcradan Sonrakı Qat)
- **Rolu:** Controller işini bitirdikdən sonra çıxan cavabı (Response) və ya xətanı (Exception) tutan qatdır.
- **Vəzifəsi:** Cavabı uniform (vahid) JSON formatına salır (`map()`), taymeri saxlayıb icra müddətini loglayır (məsələn: `25ms`).
- **Həyati Analogiya:** İclasdan çıxan qərarın standart rəsmi blanka köçürülməsi.

---

### 7️⃣ Exception Filter (Xəta Filtrasiyası)
- **Rolu:** Sistemdə baş verən hər hansı nəzərdə tutulmamış və ya xüsusi xətaları qarşılayan son qatdır.
- **Vəzifəsi:** Xətanı istifadəçiyə qorxulu proqramçı kodları kimi yox, səliqəli JSON formatında qaytarır (Məsələn: `{ statusCode: 404, message: "İstifadəçi tapılmadı", timestamp: "..." }`).
- **Həyati Analogiya:** Hər hansı problem yarandıqda müştəridən üzr istəyib rəsmi xəta bildirişi təqdim edən **Müştəri Xidmətləri**.

---

## 🎯 3. Qızıl İcra Sırası Xülasəsi

İstənilən NestJS sorğusunda icra sırası dərhal belədir:

1. **Middleware** ➡️ (Request body, CORS, Cookies)
2. **Guard** ➡️ (AuthN / AuthZ yoxlanışı)
3. **Interceptor (Pre)** ➡️ (Taymer start, Log)
4. **Pipe** ➡️ (Validation & Transformation)
5. **Controller & Service** ➡️ (Biznes məntiqi)
6. **Interceptor (Post)** ➡️ (Cavabı formatlamaq / Map)
7. **Exception Filter** ➡️ (Xətanı səliqəli qaytarmaq)
