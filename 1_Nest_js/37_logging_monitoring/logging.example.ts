import {
  Injectable,
  Logger,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// ==========================================
// 1. NESTJS BUILT-IN LOGGER İSTİFADƏSİ
// ==========================================

@Injectable()
export class PaymentService {
  // Logger üçün Kontext olaraq Klas adını veririk
  private readonly logger = new Logger(PaymentService.name);

  async processPayment(amount: number, userId: number) {
    this.logger.log(`💳 Ödəniş başladı: User #${userId}, Məbləğ: ${amount} AZN`);

    try {
      if (amount <= 0) {
        this.logger.warn(`⚠️ Keçərsiz məbləğ daxil edildi: ${amount}`);
        throw new Error('Məbləğ müsbət olmalıdır!');
      }

      // Xüsusi Debug məlumatı
      this.logger.debug(`[Debug] Bank Gateway bağlantısı quruldu...`);
      return { success: true, transactionId: 'TX_9988' };
    } catch (error) {
      // Error Log - Xətanın Stack Trace-i ilə birgə
      this.logger.error(`❌ Ödənişdə xəta yarandı! User #${userId}`, error.stack);
      throw error;
    }
  }
}

// ==========================================
// 2. HTTP LOGGING INTERCEPTOR (Sorğu Müddətini Ölçən)
// ==========================================
// Hər bir HTTP sorğusunun neçə ms vaxt apardığını avtomatik loglayır.

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`📥 ${method} ${url} - ${delay}ms`);
      }),
    );
  }
}
