// 📄 logging.interceptor.ts - Sorğunun Vaxtını Ölçən Interceptor
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // 1. PRE-CONTROLLER: Controller-dən ƏVVƏL işləyən hissə (User Note #1)
    const now = Date.now();
    console.log(`📥 [PRE-Interceptor] Sorğu Controller-ə gedir: ${method} ${url}`);

    // 2. POST-CONTROLLER: Controller cavab qaytardıqdan SONRA işləyən hissə (User Note #2)
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        console.log(`📤 [POST-Interceptor] Controller cavab verdi! Müddət: ${delay}ms`);
      }),
    );
  }
}
