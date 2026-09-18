import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * ============================================================================
 * 🌐 HTTP XƏTA FİLTRİ: HttpExceptionFilter
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * NestJS tərəfindən qəsdən atılan bəlli HTTP xətalarını
 * (məsələn: `NotFoundException` [404], `BadRequestException` [400], `UnauthorizedException` [401])
 * yaxalayır və onları müştəriyə (Frontend-ə) vahid, standartlaşdırılmış JSON formatında qaytarır.
 * 
 * 💡 HARADA VƏ NECƏ TUTULUR?
 * `@Catch(HttpException)` vasitəsilə NestJS-ə bildirilir ki, yalnız `HttpException` sinfindən
 * törəyən xətaları bu filtrlə emal et.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Konsola bildiriş loqları yazmaq üçün NestJS-in Logger sinfi
  private readonly logger = new Logger("HttpException");

  /**
   * HttpException xətası baş verdikdə bu metod avtomatik çağırılır.
   * @param exception Yaxalanan HttpException obyekti
   * @param host NestJS-in sorğu konteksti
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    // 1. HTTP kontekstini alırıq
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 2. Xətanın HTTP status kodunu (404, 400, 401 və s.) alırıq
    const status = exception.getStatus();

    // 3. Xətanın daxili mesajını/obyektini alırıq
    const exceptionResponse = exception.getResponse();

    // 4. Client-ə qaytarılacaq standart error obyektini formalaşdırırıq
    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId: request.requestId,
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as any).message,
      error:
        typeof exceptionResponse === "object"
          ? (exceptionResponse as any).error
          : undefined,
    };

    // 5. Sarı rəngdə WARN loqu yazırıq (HTTP xətaları 500 olmadığı üçün error yox, warn yazılır)
    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${JSON.stringify(
        errorResponse.message
      )}`
    );

    // 6. Cavabı status kodu ilə birlikdə müştəriyə göndəririk
    response.status(status).json(errorResponse);
  }
}

