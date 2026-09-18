import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * ============================================================================
 * 🚨 MƏRKƏZİ XƏTA FİLTRİ (BÜTÜN XƏTALAR ÜÇÜN): AllExceptionsFilter
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * NestJS-də gözlənilməz (unhandled) bütün xətaları (məsələn: baza çökdü,
 * koddakı null pointer / undefined səhvləri, 500 növlü xətalar) mərkəzləşdirilmiş
 * şəkildə tutan (catch edən) sonuncu təhlükəsizlik şəbəkəsidir.
 * 
 * 💡 FAYDASI:
 * 1. Server çökdükdə istifadəçiyə anlaşılan standart JSON xətası qaytarır (server kodlarını ifşa etmir).
 * 2. Xətanın stack trace (harada və niyə olduğunu) məlumatını loqlayır ki, proqramçı xətanı tapa bilsin.
 * 
 * `@Catch()` arqumentsiz yazıldıqda layihədəki İSTƏNİLƏN xətanı tutacağını bildirir.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Konsolda və log fayllarında xətanı loqlamaq üçün Logger obyekti
  private readonly logger = new Logger("UnhandledException");

  /**
   * Xəta baş verdikdə avtomatik çağırılan metod.
   * @param exception Baş verən xəta obyekti (tipi məlum deyil - unknown)
   * @param host NestJS-in icra konteksti (HTTP Request/Response-a giriş verir)
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 1. HTTP kontekstinə keçirik
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 2. Gözlənilməz xəta olduğu üçün HTTP statusu 500 (Internal Server Error) təyin edirik
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // 3. Xəta mesajını müəyyən edirik
    const message =
      exception instanceof Error ? exception.message : "Internal server error";

    // 4. Konsola qırmızı rəngdə böyük xəta loqu yazırıq (Stack Trace daxil olmaqla)
    this.logger.error(
      `${request.method} ${request.url} - Unhandled Exception`,
      exception instanceof Error ? exception.stack : String(exception)
    );

    // 5. Müştəriyə (Frontend-ə) standart və səliqəli xəta JSON-u göndəririk
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      requestId: request.requestId,
      message: "Internal server error",
    });
  }
}

