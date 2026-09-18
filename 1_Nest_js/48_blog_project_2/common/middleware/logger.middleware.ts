import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

/**
 * ============================================================================
 * 📝 HTTP LOQLAMA MİDDLEWARE-İ: LoggerMiddleware
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Middleware (Arada duran proqram) — HTTP sorğusu serverə çatan an
 * (Guard-lardan, Interceptor-lardan, Pipe-lardan və Controller-dən də ƏVVƏL)
 * ilk işə düşən Express/NestJS təbəqəsidir.
 * 
 * `LoggerMiddleware` serverə gələn hər bir HTTP sorğusunun təfərrüatlarını:
 * - Request ID
 * - HTTP Metodu (GET, POST və s.)
 * - URL (ünvan)
 * - HTTP Status Kodu (200, 404, 500 və s.)
 * - Sorğunun icra müddətini (ms)
 * - İstifadəçinin IP ünvanını və Brauzer məlumatını (User-Agent)
 * mərkəzi konsol loquna yazır.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // NestJS-in "HTTP" prefiksli loq yazan obyekti
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Sorğu məlumatlarını daxil olan HTTP Request obyektindən çıxarırıq
    const { method, originalUrl, ip } = req;
    const userAgent = req.get("user-agent") || "";
    const requestId = req.requestId || "unknown";

    // 2. Sorğunun başladığı anın vaxtını saxlayırıq
    const start = Date.now();

    // 3. `res.on('finish')` event listener-i: Cavab müştəriyə tam göndərilib bitəndə işə düşür
    res.on("finish", () => {
      const { statusCode } = res;
      // İcra müddətini hesablayırıq
      const duration = Date.now() - start;

      // Konsola sistem loqunu çıxarırıq: Məsələn "[uuid] GET /api/v1/posts 200 - 12ms - ::1 - Mozilla/5.0"
      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip} - ${userAgent}`
      );
    });

    // 4. ƏN VACİB MƏQAM: `next()` çağırılmalıdır ki, sorğu növbəti middleware və ya NestJS pipeline-na keçsin!
    next();
  }
}

