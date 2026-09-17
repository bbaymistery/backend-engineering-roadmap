// 📄 all-exceptions.filter.ts - Bütün Gözlənilməz Xətaları Tutacaq Qlobal Filter
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 👈 Mötərizə boşdur: BÜTÜN xətaları (HTTP və ya Sistem Xətalarını) tutur!
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Əgər HTTP Exception-dırsa öz statusunu, əks halda 500 Internal Server Error veririk
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Sistemdə daxili gözlənilməz xəta baş verdi!';

    console.error('💥 [AllExceptionsFilter] Server Daxili Xətası:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      error: status === 500 ? 'Internal Server Error' : 'Http Error',
    });
  }
}
