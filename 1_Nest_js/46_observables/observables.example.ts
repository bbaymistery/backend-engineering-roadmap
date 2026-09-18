import { Observable, of, firstValueFrom } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';

// ==========================================
// 1. SADƏ OBSERVABLE YARADILMASI VƏ ABUNƏ OLMUQ (Subscribe)
// ==========================================

export function runObservableDemo() {
  // 1, 2, 3 rəqəmlərindən ibarət data axını (Stream) yaradırıq
  const numbers$: Observable<number> = of(1, 2, 3, 4, 5);

  numbers$
    .pipe(
      // Yalnız cüt rəqəmləri süzür
      filter((n) => n % 2 === 0),
      // Rəqəmləri 10-a vurur
      map((n) => n * 10),
      // Yan təsir: Konsola yazır
      tap((n) => console.log(`🔍 Axındakı data: ${n}`)),
    )
    .subscribe({
      next: (val) => console.log(`✅ Qəbul edildi: ${val}`),
      complete: () => console.log('🏁 Axın bitdi!'),
    });
}

// ==========================================
// 2. NESTJS INTERCEPTOR-DA OBSERVABLE İSTİFADƏSİ
// ==========================================

@Injectable()
export class CustomLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => console.log(`[RxJS tap] Sorğu müddəti: ${Date.now() - startTime}ms`)),
      map((data) => ({
        success: true,
        response: data,
      })),
    );
  }
}

// ==========================================
// 3. OBSERVABLE-IN PROMISE-Ə ÇEVRİLMƏSİ (firstValueFrom)
// ==========================================

export async function convertObservableToPromise() {
  const data$: Observable<string> = of('NestJS RxJS Məlumatı');

  // Observable -> Promise dönüşümü (async/await ilə işləmək üçün)
  const result = await firstValueFrom(data$);
  console.log('🔄 Promise-ə çevrilmiş cavab:', result);
  return result;
}
