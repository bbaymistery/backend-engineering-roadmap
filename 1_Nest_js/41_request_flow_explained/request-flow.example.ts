import {
  Injectable,
  NestMiddleware,
  CanActivate,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  PipeTransform,
  BadRequestException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UseFilters,
  Query,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// ==========================================
// STEP 1: MIDDLEWARE (KPP - Rentgen Nəzarəti)
// ==========================================
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[1. Middleware] Daxil olan sorğu: ${req.method} ${req.url}`);
    next();
  }
}

// ==========================================
// STEP 2: GUARD (Mühafizəçi - Giriş Yoxlanışı)
// ==========================================
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('[2. Guard] İstifadəçi icazəsi yoxlanılır...');
    return true; // Girişə icazə verildi
  }
}

// ==========================================
// STEP 3 & 6: INTERCEPTOR (Pre & Post Controller)
// ==========================================
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log('[3. Interceptor Pre] İcra taymeri başladıldı...');

    return next.handle().pipe(
      tap(() => console.log(`[6. Interceptor Post] İcra müddəti: ${Date.now() - now}ms`)),
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}

// ==========================================
// STEP 4: PIPE (Tərəzi - Validation & Transformation)
// ==========================================
@Injectable()
export class ParseAgePipe implements PipeTransform {
  transform(value: any) {
    console.log('[4. Pipe] Gələn data validasiya olunur...');
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Yaş parametri rəqəm olmalıdır!');
    }
    return val;
  }
}

// ==========================================
// STEP 7: EXCEPTION FILTER (Müştəri Xidmətləri)
// ==========================================
@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('[7. Exception Filter] Xəta tutuldu və formatlandı!');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      customErrorNote: 'Xəta Exception Filter tərəfindən idarə olundu.',
    });
  }
}

// ==========================================
// STEP 5: CONTROLLER & SERVICE (Müdirlük Otağı)
// ==========================================
@Controller('flow')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
@UseFilters(CustomExceptionFilter)
export class FlowController {
  @Get()
  getFlowData(@Query('age', ParseAgePipe) age: number) {
    console.log('[5. Controller & Service] Biznes məntiqi icra olunur...');
    return { userAge: age, status: 'Active' };
  }
}
