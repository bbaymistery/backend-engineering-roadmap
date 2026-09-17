// 📄 timeout.interceptor.ts - Çox Uzanan Sorğuları Ləğv Edən Interceptor
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 5000ms (5 saniyə) ərzində Controller cavab verməsə, ləğv et!
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException('Sorğu çox vaxt apardı (Timeout 5s)!'),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
