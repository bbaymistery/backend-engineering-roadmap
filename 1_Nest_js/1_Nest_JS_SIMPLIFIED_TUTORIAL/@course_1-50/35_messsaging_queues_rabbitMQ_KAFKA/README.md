# 📬 NestJS: Messaging, Queues & Events (#35)

Salam! **`35_messsaging_queues_rabbitMQ_KAFKA`** dərsinə xoş gəldin!

Əgər *"Redis nədir, RabbitMQ nədir, Kafka nədir, bunlar TypeORM ilə bağlıdırmı?"* deyə başın qarışıbsa, hiç narahat olma! Bu sənəddə **heç bir şəkil olmadan**, ən sadə analogiyalar və təmiz TypeScript kodları ilə mövzunun mahiyyətini sıfırdan anlayacaqsan.

---

## ❓ 1. Ən Vacib Sual: Bunların TypeORM İlə Əlaqəsi Var?

### **XEYR! ❌ Qətiyyən Yoxdur!**
Başını heç qarışdırma:
- **TypeORM / Prisma:** Verilənlər bazası (PostgreSQL, MySQL cədvəlləri) ilə işləmək üçün **Tərcüməçidir**.
- **RabbitMQ / Kafka / Redis:** Mikroservislər və ya arxa fon işləri (Background Tasks) arasında xəbərləşmək üçün **Poçtalyon / Növbə (Queue)** sistemidir.

Yəni TypeORM bazada məlumat saxlayır, RabbitMQ/Kafka isə mikroservislər bir-birinə mesaj atan zaman ortada körpü rolunu oynayır!

---

## 🍕 2. Ən Sadə Həyati Analogiya (Restoran Sifarişi)

Təsəvvür et ki, böyük bir restorandasınız:
1. **İstifadəçi (Customer)** kassaya yaxınlaşır və 100 dənə pizza sifariş edir.
2. Əgər **Kassir (NestJS API)** hər pizzanı bişirib qurtarana qədər istifadəçini kassanın qabağında gözlətsə, arxada 1 saatlıq növbə yaranacaq və sistem çökəcək (**Synchronous Blocking**).
3. Bunun əvəzinə Kassir sifarişi qəbul edən kimi istifadəçiyə qəbz verir və tapşırığı **Xüsusi Sifariş Lövhəsinə (Message Broker / Queue)** yapışdırır.
4. Mətbəxdəki başqa **Aşpazlar (Consumer Microservices)** o lövhədən növbə ilə sifarişləri götürüb sakitcə bişirirlər (**Asynchronous Queue**).

Məhz **RabbitMQ, Kafka və Redis** həmin O Sifariş Lövhəsidir!

---

## 🆚 3. Redis, RabbitMQ və Kafka Fərqi Nədir?

| Broker | Nədir? | Həyati Analogiya | Ən Yaxşı İstifadə Sahəsi | NestJS Transport |
| :--- | :--- | :--- | :--- | :--- |
| **RabbitMQ** | Ən etibarlı növbə (Queue) brokeridir. | **Etibarlı Poçtalyon** (Mesajı alana qədər zərfidə saxlayır). | Ödənişlərin emalı, Email/SMS göndərişi, Növbəli işlər. | `Transport.RMQ` |
| **Kafka** | Yüksək sürətli Data/Stream sistemidir. | **Böyük Tır Karvanı** (Saniyədə milyonlarla datanı axınla aparır). | Big Data, Log toplama, Uber-də canlı GPS izləmə, Kliklərin izlənməsi. | `Transport.KAFKA` |
| **Redis** | Ultran-sürətli yaddaş (RAM) bazasıdır. | **Göz Qabağındakı Qeyd Dəftəri** | Keşləmə (Caching), Pub/Sub, Anlıq bildirişlər (BullMQ). | `Transport.REDIS` |

---

## 🌐 4. Reallıqda (Real-World Projects) RabbitMQ və Kafka Necə İşlədilir?

> [!IMPORTANT]
> **🚀 Real Layihə Nümunələri:**
>
> 1. **RabbitMQ (Mikroservislər Arası Etibarlı Mesajlaşma):**
>    - **Bolt / Uber / Wolt:** İstifadəçi "Taksi Sifariş Et" düyməsini basır (`Order Service`). Sifariş yarandıqdan sonra `Order Service` RabbitMQ-ya `ORDER_CREATED` hadisəsi atır. `Notification Service` o hadisəni tutub sürücülərə bildiriş göndərir, `Payment Service` ödənişi dondurur. Xidmətlər bir-birindən asılı deyil, müstəqildir!
>    - **E-Ticarət (Trendyol / Amazon):** Sifariş tamamlandıqda `Payment Service` ödənişi götürür və RabbitMQ-ya `PAYMENT_SUCCESS` mesajı atır. `SMS Service` istifadəçiyə SMS vurur, `Warehouse Service` anbarı yeniləyir.
>
> 2. **Kafka (Böyük Data Axını və Log Streaming):**
>    - **Uber / Yandex Go:** Saniyədə 500,000 sürücünün canlı GPS koordinatları itkisiz olaraq Kafka-ya axır və real-time emal olunur.
>    - **Banklar / Visa / Mastercard:** Fraud (dəlduzluq) tespiti üçün həyata keçirilən bütün kart əməliyyatlarının canlı axını Kafka vasitəsilə mərkəzi analitika sisteminə ötürülür.
>    - **Trendyol / Netflix:** İstifadəçinin saytda etdiyi hər bir klik, axtarış və izləmə tarixi Kafka vasitəsilə Big Data bazasına axıdılır.

---

## 🏗️ 5. NestJS-də İki Əsas Xəbərləşmə Modeli

Messacing sistemlərində 2 cür mesaj göndərilir:

```text
1. Event Pattern (Fire and Forget - At və Unut):
   Producer ──► 'order_created' ──► Consumer (Email vurur, stok yeniləyir)
   (Producer cavab gözləmir, işinə davam edir)

2. Message Pattern (Request-Response - Cavab Gözləyən):
   Producer ──► 'process_payment' ──► Consumer ──► Cavab qaytarır (Success/Failed)
   (Producer cavab gələnə qədər await edir)
```

---

## 💻 6. Kod Nümunələri

### A) RabbitMQ Producer (Mesajı Göndərən `main.ts` & `service.ts`)

```typescript
// 📄 main.ts (Hybrid App setup)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // RabbitMQ mikroservis bağlantısı
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
```

```typescript
// 📄 orders.service.ts (Mesaj Yollayan Service)
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy
  ) {}

  async createOrder(orderData: any) {
    // 1. Fire & Forget (Event): Cavab gözləmədən xəbər verir
    this.client.emit('order_created', orderData);

    // 2. Request-Response (Message): Cavab gözləyir
    // const paymentResult = await this.client.send('process_payment', orderData).toPromise();

    return { message: 'Sifariş qəbul olundu, emal edilir!' };
  }
}
```

---

### B) RabbitMQ Consumer (Mesajı Qəbul Edən `controller.ts`)

```typescript
// 📄 orders.controller.ts (Mesajı Eşidən Controller)
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  
  // 1. Event Eşidən (Fire & Forget)
  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    console.log('📬 Yeni sifariş daxil oldu, Email göndərilir:', data);
    // Email göndərmək, Anbarı yeniləmək məntiqi
  }

  // 2. Request-Response Eşidən
  @MessagePattern('process_payment')
  handlePayment(@Payload() data: any) {
    console.log('💳 Ödəniş emal olunur:', data);
    return { status: 'SUCCESS', transactionId: 'TX12345' };
  }
}
```

---

## 🎯 7. Qızıl Xülasə

1. **TypeORM ilə əlaqəsi yoxdur!** TypeORM bazadır, bunlar mesajlaşma vasitəsidir.
2. **RabbitMQ:** Ən etibarlı task/queue sistemidir.
3. **Kafka:** Böyük data/stream sistemləridir (Uber, Klik izləmə).
4. **Redis:** Çox sürətli RAM bazasıdır (Caching & Pub/Sub).
5. **EventPattern:** `emit()` — Atır və unudur (Fire & Forget).
6. **MessagePattern:** `send()` — Sorğu göndərir və cavab gözləyir (Request-Response).
