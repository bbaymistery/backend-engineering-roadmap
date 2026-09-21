# 📊 NestJS: Logging & Monitoring (#37)

Salam! **`37_logging_monitoring`** dərsinə xoş gəldin!

Əvvəlki dərsdə olduğu kimi, bu sənəddə də boilerplate kod kopyalamaq əvəzinə, **Logging və Monitoring** sistemlərinin nə olduğunu, **Pino**, **Winston**, **Prometheus**, **Grafana** kimi alətlərin nə işə yaradığını, sistemə verdiyi **Üstünlükləri (Advantages)** və **Dezavantajları (Disadvantages)** senior səviyyəsində anlayacaqsan.

---

## ❓ 1. Niyə Logging & Monitoring Lazımdır? (Problem)

### ⚠️ Problem (Qaranlıq Mühit):
Local kompyuterində kod yazarkən `console.log()` istifadə edirsən və terminalda nə baş verdiyini görürsən. 
Lakin proqram **Production** (canlı server) mühitinə çıxarıldıqda sən artık terminal qarşısında oturmursan!
Gecə saat 03:00-da serverdə xəta baş verərsə:
- Proqram niyə çöxdü?
- Hansı istifadəçinin sorğusunda xəta oldu?
- Bazaya qoşulma qopdumu?

`console.log()` canlı serverdə **yaddaş sızmasına (Memory Leak)** səbəb olur, nizamlı (structured) deyil və avtomatlaşdırılmış sistemlər tərəfindən oxuna bilmir.

### ✅ Həll (Structured Logging & Monitoring):
1. **Structured Logging (Pino / Winston):** Bütün log-ları nizamlı **JSON** formatında fayla və ya mərkəzi log serverinə (ELK Stack - Elasticsearch/Kibana, Datadog) göndərir.
2. **Monitoring (Prometheus + Grafana):** Serverin CPU, RAM sərflərini, sorğu sürətlərini (Latency) və xəta faizlərini (Error Rate) canlı qrafiklərlə göstərir.

---

## 🪵 2. Log Səviyyələri (Log Levels) Nədir?

Log-lar önəminə görə 5 əsas səviyyəyə bölünür:

```text
🔴 ERROR   : Mütləq müdaxilə olunmalı kritik sistem xətaları (DB qoşulması qopdu, Uncaught Exception).
🟠 WARN    : Xəta deyil, amma riskli hal (Xarici servis 3-cü cəhddə cavab verdi, Disk 85% doludur).
🟢 LOG/INFO: StandartHadisələr (Server işə düşdü, İstifadəçi qeydiyyatdan geçti).
🔵 DEBUG   : Tərtibatçılar üçün xüsusi diaqnostika məlumatları (DTO strukturu, sorğu parametrləri).
🟣 VERBOSE : Ən xırda sistem izləri (Daxili funksiya icra müddətləri).
```

---

## 🛠️ 3. Əsas Kitabxanalar və Alətlər

### A) Logging Kitabxanaları (Log Yaradanlar)

| Kitabxana | Xüsusiyyəti | Nə vaxt istifadə olunur? |
| :--- | :--- | :--- |
| **Built-in NestJS Logger** | NestJS-in daxili `Logger` klasıdır. | Kiçik və ya orta layihələrin başlanğıcında. |
| **Pino (`nestjs-pino`)** | **Ən sürətli** və yüngül JSON logger-idir. | **Müasir High-Performance layihələrdə!** (Winston-dan 5-10 dəfə sürətlidir). |
| **Winston (`nest-winston`)** | Çox şaxəli (Transports) log yazma imkanı var (Eyni anda Fayla, Bazaya və Konsola yazır). | Klassik Enterprise layihələrdə. |

---

### B) Monitoring və Tracing Alətləri (Səhhəti İzləyənlər)

| Alət | Məqsədi | Həyati Analogiya |
| :--- | :--- | :--- |
| **Prometheus + Grafana** | Server metrikalarını (CPU, RAM, Saniyədəki sorğu sayı - RPS) toplayır və canlı vizual qrafiklər yaradır. | Xəstəxanalardakı **Ürək Döyüntüsü Monitoru**. |
| **OpenTelemetry** | Mikroservislər arasında sorğunun hansı servisdə neçə ms vaxt keçirdiyini izləyir (**Distributed Tracing**). | Kuryerin xəritədəki canlı izlənməsi. |
| **New Relic / Datadog** | Həm log, həm metrika, həm də canlı bildirişlər verən bütöv pullu bulud APM platformalarıdır. | Bütöv Özəl Xəstəxana Kompleksi. |

---

## 🌟 4. Üstünlükləri və Dezavantajları

### 🌟 Üstünlükləri (Advantages):
1. **🔍 Post-Mortem Debugging (Dəqiq Xəta Axtarışı):**
   Xəta olan kimi istifadəçinin İD-si, `stack trace` və dəqiq saniyəsi ilə log arxivindən xətanın kök səbəbini 1 dəqiqəyə tapırsan.
2. **🔔 Canlı Xəbərdarlıqlar (Real-time Alerts):**
   Serverdə 500 xətaları artanda və ya RAM 90%-i keçəndə Slack və ya Telegram-a avtomatik Alert mesajı gəlir.
3. **⚡ Performance Bottleneck Tespiti:**
   Hansı Database sorğusunun sistemdə 5 saniyə ləngimə yaratdığını Grafana panellərində dərhal görürsən.

### ⚠️ Dezavantajları (Disadvantages):
1. **💾 Disk və İ/O Yükü:** Həddindən artıq `debug` log-u yazmaq server diski tez doldura bilər (Pino kimi sürətli JSON logger-lər məhz buna görə seçilir).
2. **🔐 Məxfilik (PII Leakage) Riski:** Log-lara bilmədən istifadəçinin şifrəsini və ya kredit kartı məlumatlarını yazmaq böyük təhlükəsizlik xətasıdır (**Log Redaction** edilməlidir).

---

## 💻 5. Qısa İnteqrasiya Nümunələri

### A) Built-in Logger & Pino Setup

```typescript
// 📄 main.ts (Pino Logger Qoşulması)
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger)); // Standard console.log-ları Pino-ya yönləndirir
  await app.listen(3000);
}
bootstrap();
```

```typescript
// 📄 users.service.ts (Logger İstifadəsi)
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async createUser(userDto: any) {
    this.logger.log(`Yeni istifadəçi qeydiyyatı başladı: ${userDto.email}`);
    
    try {
      // Bizness məntiqi...
    } catch (error) {
      this.logger.error('İstifadəçi yaradılarkən xəta baş verdi!', error.stack);
    }
  }
}
```

---

## 🎯 6. Qızıl Xülasə

1. **`console.log()` canlı mühitdə istifadə olunmamalıdır!**
2. **Pino:** Sürətli və yüngül JSON log-lar üçün müasir standartdır.
3. **Prometheus + Grafana:** Serverin CPU/RAM və sorğu metrikalarını izləmək üçündür.
4. **Error Log:** Xətanın kökünü və `stack trace`-ini tapmaq üçün ən vacib silahdır.
