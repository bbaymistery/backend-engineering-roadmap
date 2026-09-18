import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Frontend-ə (və ya API müştərisinə) qaytarılacaq vahid cavab interfeysi.
 * Bütün uğurlu cavablar bu formatda büküləcək.
 */
export interface ApiResponse<T> {
  success: boolean;   // Uğurludurmu (həmişə true)
  data: T;            // Controller metodundan qayıdan əsl məlumat (User, Post, Array və s.)
  timestamp: string;  // Cavabın yaradıldığı vaxt (ISO formatında)
  requestId?: string; // Sorğunun unikal Request ID-si (bax: request-id.middleware.ts)
}

/**
 * ============================================================================
 * 🔄 CAVAB TRANSFORMASİYASI İNTERCEPTOR-U: TransformInterceptor
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * NestJS Controller metodları sadəcə obyekt və ya massiv qaytarır.
 * Məsələn: `return { name: "Ali" }`.
 * 
 * `TransformInterceptor` bütün uğurlu cavabları mərkəzi şəkildə yaxalayır və
 * onları standart çərçivəyə (wrapper) salır:
 * 
 * {
 *   "success": true,
 *   "data": { "name": "Ali" },
 *   "timestamp": "2026-09-18T18:00:00.000Z",
 *   "requestId": "550e8400-e29b-41d4-a716-446655440000"
 * }
 * 
 * 💡 NECƏ İŞLƏYİR?
 * RxJS-in `map` operatorundan istifadə edərək `data`-nı götürür və yeni obyekt formalaşdırır.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponse<T>> {
    // 1. Request obyektindən `requestId`-ni götürürük (middleware tərəfindən yazılmış)
    const request = context.switchToHttp().getRequest();
    const requestId = request["requestId"];

    // 2. Controller metodunun işi bitdikdən sonra məlumatı `map` ilə çeviririk (transform edirik)
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId,
      }))
    );
  }
}

