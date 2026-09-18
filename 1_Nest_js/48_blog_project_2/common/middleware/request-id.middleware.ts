import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * ============================================================================
 * 🆔 UNİKAL SORĞU İD MİDDLEWARE-İ: RequestIdMiddleware
 * ============================================================================
 * 
 * ❓ NƏDİR VƏ NƏ İŞƏ YARIYIR?
 * Backend proqramlaşdırmada və mikroservislərdə hər bir daxil olan HTTP sorğusuna
 * təkrarolunmaz (unikal) bir kimlik nömrəsi — **Request ID** (UUID v4) vermək çox vacibdir.
 * 
 * 💡 NƏ FAYDASI VAR?
 * 1. Loglarda axtarış: Eyni anda 1000 sorğu gəlsə belə, müəyyən bir istifadəçinin
 *    sorğusunun tam olaraq necə icra olunduğunu bu ID vasitəsilə izləmək (tracing) olur.
 * 2. Frontend ilə inteqrasiya: Sorğu cavabında header-də `X-Request-Id` kimi qaytarılır.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Əgər sorğu verən (Frontend və ya API Gateway) özü 'x-request-id' header-i göndəribsə, onu istifadə edirik.
    // Əks halda `uuidv4()` ilə yeni unikal UUID (Məs: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d') yaradırıq.
    const requestId = (req.headers["x-request-id"] as string) || uuidv4();

    // 2. Bu ID-ni daxili `req` obyektinə mənimsədirik ki, digər Interceptor və Filter-lər də oxuya bilsin.
    req.requestId = requestId;

    // 3. Müştəriyə qaytarılacaq HTTP Response header-inə "X-Request-Id" başlığını yerləşdiririk.
    res.setHeader("X-Request-Id", requestId);

    // 4. Sorğunun zəncir üzrə davam etməsi üçün `next()` çağırırıq.
    next();
  }
}

