// 📄 transform.interceptor.ts - Cavabı Vahid Formatlaşdıran Interceptor
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  data: T;
  success: boolean;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    // Controller-dən gələn cavabı nizamlı JSON obyektinə salırıq:
    return next.handle().pipe(
      map((data) => ({
        data: data,
        success: true,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
