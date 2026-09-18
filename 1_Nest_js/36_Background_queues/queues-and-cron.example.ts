import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

// ==========================================
// 1. CRON JOBS & SCHEDULED TASKS (@nestjs/schedule)
// ==========================================
// Bu alət daxili Taymerlər və Cədvəlli tapşırıqlar üçündür.

@Injectable()
export class ScheduledTasksService {
  // 1. Hər gecə saat 00:00-da avtomatik icra olunan Cron İş
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleMidnightCleanup() {
    console.log('🧹 [Cron Job] Müddəti bitmiş sessiyalar və müvəqqəti fayllar təmizləndi.');
  }

  // 2. Hər 10 saniyədən bir təkrar olunan İnterval
  @Interval(10000)
  handleHeartbeat() {
    console.log('💓 [Interval Task] Sistem sağlamlıq yoxlaması (Healthcheck)...');
  }

  // 3. Server başladıqdan 5 saniyə sonra 1 dəfə işə düşən Taymout
  @Timeout(5000)
  handleOneTimeStartupTask() {
    console.log('🚀 [Timeout Task] Server işə düşdü, ilkin keş hazırlığı tamamlandı.');
  }
}

// ==========================================
// 2. BULLMQ QUEUE PRODUCER & PROCESSOR (CONCEPTUAL)
// ==========================================
// BullMQ Redis istifadə edərək arxa fonda növbəli işləri idarə edir.

export interface ExportReportJobData {
  userId: number;
  reportType: 'PDF' | 'EXCEL';
}

@Injectable()
export class ReportQueueProducer {
  async addReportToQueue(data: ExportReportJobData) {
    console.log(`📥 [BullMQ Producer] Hesabat yaradılması növbəyə əlavə olundu: User #${data.userId}`);
    // Real mühitdə: await this.reportQueue.add('generate_report', data, { attempts: 3, delay: 1000 });
  }
}

@Injectable()
export class ReportQueueProcessor {
  async processReport(data: ExportReportJobData) {
    console.log(`⚙️ [BullMQ Worker] Hesabat arxa fonda yaradılır: ${data.reportType}...`);
    // Real mühitdə: PDF/Excel faylı yaradılır və istifadəçiyə email atılır.
  }
}
