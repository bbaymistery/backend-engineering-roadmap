// 📄 http-exception.filter.ts - Custom Exception Filter
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 👈 Sırf HttpException xətalarını tutmaq üçün
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Xətanın mesaj hissəsini təmizləyirik
    const errorMessage =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any).message || exception.message
        : exception.message;

    console.log(`🚨 [ExceptionFilter] Xəta Tutuldu: [${request.method}] ${request.url} -> Status: ${status}`);

    // Müştəriyə (Frontend-ə) standart, nizami JSON cavabı hazırlayırıq:
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
    });
  }
}
