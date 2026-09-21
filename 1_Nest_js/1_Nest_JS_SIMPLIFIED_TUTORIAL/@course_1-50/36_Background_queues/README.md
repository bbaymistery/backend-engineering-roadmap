# ⏳ NestJS: Background Jobs & Queues (#36)

Salam! **`36_Background_queues`** dərsinə xoş gəldin!

Haqqlı olaraq qeyd etdiyin kimi, kodun inteqrasiyasını istənilən vaxt rəsmi sənədləşmədən (documentation) baxa bilərik. Əsas məsələ **Background Queues (Arxa Fon Növbələri)** və **Cron Jobs**-un nə üçün lazım olduğunu, sistemə verdiyi **Üstünlükləri (Advantages)**, **Dezavantajları (Disadvantages)** və reallıqda hansı problemləri həll etdiyini senior səviyyədə anlamaqdır.

---

## ❓ 1. Həll Etdiyi Əsas Problem Nədir?

### ⚠️ Problem (Sinxron Gözləmə Tələsi):
Təsəvvür et ki, istifadəçi saytda **"Qeydiyyatdan Geç"** düyməsini basır.
Əgər backend istifadəçini bazaya yazdıqdan sonra, ona **Xoş gəldiniz Email-i** və **SMS** göndərirsə, bu əməliyyat xarici SMTP/SMS serverləri səbəbindən 3-5 saniyə vaxt aparacaq.
İstifadəçinin ekranı fırlanacaq və gözləyəcək. Əgər eyni anda 5,000 nəfər düyməni bassa, server donacaq və ya `Timeout Error` verəcək!

### ✅ Həll (Background Queue / Arxa Fon Növbəsi):
Backend istifadəçini bazaya yazan kimi **0.01 saniyəyə** `201 Created` cavabı qaytarır. Email göndərmək tapşırığını isə **BullMQ Növbəsinə (Queue)** atır. BullMQ arxa fonda istifadəçini gözlətmədən email-ləri tək-tək göndərir.

---

## 🌟 2. Background Queues (Bull / BullMQ) Üstünlükləri (Advantages)

1. **⚡ İnanılmaz Sürətli Cavab (Fast API Response Time):**
   İstifadəçi xarici servis operasiyalarını (Email, SMS, PDF yaratma) gözləmir. API millisaniyələr ərzində cavab verir.

2. **🔄 Avtomatik Təkrar Cəhd (Automatic Retries & Backoff):**
   Əgər email göndərən zaman internet kəsilsə və ya SMTP serveri çöksə, BullMQ tapşırığı itirmir! Müəyyən etdiyin qayda ilə (məsələn: 3 dəfə, 5 saniyə intervalı ilə) avtomatik təkrar cəhd edir (`attempts: 3, backoff: 5000`).

3. **🚦 Yükün İdarə Olunması və Limitlənməsi (Rate Limiting & Concurrency):**
   Saniyədə 50,000 tapşırıq gəlsə belə, server çökmür. Sən deyirsən: *"Mənim serverim saniyədə maksimum 10 email göndərsin"*. BullMQ onları növbəyə düzür və tənzimləyir.

4. **⏱️ Gecikdirilmiş İşlər (Delayed Jobs):**
   Məsələn: *"İstifadəçi qeydiyyatdan geçəndən 3 gün sonra ona xatırlatma emaili at"*. `delay: 3 * 24 * 60 * 60 * 1000` yazırsan, dəqiq 3 gündən sonra işə düşür.

5. **💾 Yaddaşda Qalıcılıq (Persistence & Crash Recovery):**
   BullMQ məlumatları **Redis** daxilində saxladığı üçün, proqram/server sönsə və ya çöksə belə, növbədəki tapşırıqlar silinmir! Server yenidən açılanda yarımçıq qalan işləri qaldığı yerdən davam etdirir.

---

## ⚠️ 3. Dezavantajları (Disadvantages)

1. **🛠️ Əlavə İnfrastruktur Asılılığı (Redis Requirement):**
   Bull/BullMQ işlətmək üçün sistemdə **Redis** serveri quraşdırılmalı və idarə olunmalıdır.
2. **🧩 Sistem Mürəkkəbliyi (System Complexity):**
   Hadisələrin nə vaxt bitdiyini izləmək (Debugging) və log-ları nəzarətdə saxlamaq sinxron koda nəzərən bir qədər çətindir.
3. **⌛ Anlıq Cavab Alınmır (Eventual Consistency):**
   İstifadəçi düyməni basan an tapşırığın nəticəsi dərhal hazır olmaya bilər (məsələn: Video yüklənən kimi emal olunmur, 1 dəqiqə sonra hazır olur).

---

## 🆚 4. BullMQ (Queues) vs Cron Jobs (`@nestjs/schedule`)

Bir çox proqramçı bu ikisini qarışdırır. Gəl aralarındakı fərqə baxaq:

| Xüsusiyyət | BullMQ / Bull (Job Queues) | Cron Jobs (`@nestjs/schedule`) |
| :--- | :--- | :--- |
| **Nə vaxt işə düşür?** | Hadisə (Event) baş verən an dinamik olaraq növbəyə atılır. | Əvvəlcədən təyin olunmuş **dəqiq vaxtda/cədvəldə** (Məsələn: Hər gecə saat 00:00-da). |
| **İstifadə Sahələri** | Qeydiyyat emaili, Fayl çevrilməsi (PDF/Video), Webhook təkrar cəhdləri. | Gündəlik balans hesabatı hazırlamaq, Hər saat bazanın backup-ını almaq, Müddəti bitmiş abunəlikləri ləğv etmək. |
| **Server Restart Olsa?** | Məlumat Redis-də olduğu üçün **İTMİR**, qaldığı yerdən davam edir. | Yaddaşda (RAM) olduğu üçün həmin an nəzərdə tutulan iş **ÖTÜRÜLƏ BİLƏR**. |

---

## 🌐 5. Reallıqda (Real-World Projects) Cron Jobs və BullMQ Harada İşlədilir?

> [!IMPORTANT]
> **🚀 Real Layihə Nümunələri:**
>
> 1. **Cron Jobs (`@nestjs/schedule` - Vaxta Bağlı Zəngli Saat):**
>    - **Trendyol / Amazon:** Hər gecə saat 00:00-da satıcıların günlük balansı və ödəniş hesabatları avtomatik hesablanır.
>    - **Abunəlik Sistemləri (Netflix / Spotify / SaaS):** Hər gün səhər saat 09:00-da müddəti bitmiş istifadəçilərin abunəlik statusu `EXPIRED` edilir və abunəlik dayandırılır.
>    - **Verilənlər Bazası Backup:** Hər bazar günü saat 03:00-da bazanın ehtiyat nüsxəsi (Backup) alınıb bulud anbarına (S3) yüklənir.
>
> 2. **BullMQ / Bull (Arxa Fon Növbəli Ağır İşlər):**
>    - **YouTube / TikTok / Instagram:** İstifadəçi video yükləyir (`POST /upload`). API dərhal "Video qəbul edildi" deyir. Video-nu 480p, 720p, 1080p formatlarına çevirmək (transcoding) işi **BullMQ** növbəsinə atılır.
>    - **E-Ticarət (Trendyol / İcra sənədləri):** İstifadəçi ayın sonunda PDF faktura tələb edir. Mürəkkəb PDF fakturanı generasiya edib email-ə atmaq **BullMQ** növbəsində icra edilir.
>    - **Kütləvi Bildirişlər (Mass Mailer):** 100,000 istifadəçiyə eyni anda reklam emaili göndərmək.

---

## 💻 6. Qısa İnteqrasiya Nümunələri

### A) BullMQ (Job Queue) Setup & Usage

```bash
npm install @nestjs/bullmq bullmq
```

```typescript
// 1. Modula Qoşulma (app.module.ts)
BullModule.forRoot({
  connection: { host: 'localhost', port: 6379 }
}),
BullModule.registerQueue({ name: 'email_queue' })

// 2. Növbəyə Tapşırıq Əlavə Etmək (Producer - email.service.ts)
@Injectable()
export class EmailService {
  constructor(@InjectQueue('email_queue') private emailQueue: Queue) {}

  async sendWelcomeEmail(user: any) {
    await this.emailQueue.add('send_welcome', { email: user.email }, {
      attempts: 3,         // 3 dəfə təkrar cəhd et
      backoff: 5000,       // Xəta olsa 5 saniyə gözlə
      removeOnComplete: true,
    });
  }
}

// 3. Arxa Fondakı Tapşırığı İcra Etmək (Consumer - email.processor.ts)
@Processor('email_queue')
export class EmailProcessor {
  @Process('send_welcome')
  async handleWelcome(job: Job) {
    console.log(`📧 Email arxa fonda icra olunur: ${job.data.email}`);
  }
}
```

---

### B) Cron Jobs (`@nestjs/schedule`)

```bash
npm install @nestjs/schedule
```

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  // Hər gecə saat 00:00-da avtomatik işə düşür
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleDailyBackup() {
    console.log('📦 Gündəlik Baza Backup-ı alındı!');
  }
}
```

---

## 🎯 7. Qızıl Xülasə

1. **İstifadəçini Gözlətmə:** 1 saniyədən uzun çəkən bütün işləri (Email, PDF, İmage resize) Arxa Fon Növbəsinə (BullMQ) at!
2. **BullMQ:** Redis ilə işləyir, təkrar cəhd (Retry) və gecikdirilmiş işlər (Delay) üçün mükəmməldir.
3. **Cron Jobs:** Dövri olaraq müəyyən saatlarda təkrar olunan işlər üçündür (Backup, Hesabat).
