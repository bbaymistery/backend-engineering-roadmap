import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Header,
  Redirect,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('demo')
export class ResponseDemoController {
  /**
   * 1️⃣ Custom HTTP Status Code
   * 
   * 💡 NestJS-də standart olaraq GET = 200 OK, POST = 201 Created qaytarır.
   * Əgər xüsusi status kod qaytarmaq istəyiriksə, `@HttpCode()` dekoratorundan istifadə edirik.
   * `HttpStatus` enum-ı xətaların qarşısını alır (məs: HttpStatus.NO_CONTENT = 204).
   */
  @Post('custom-status')
  @HttpCode(HttpStatus.ACCEPTED) // 202 Accepted qaytarır
  createSomething() {
    return {
      message: 'Sorğu qəbul edildi və emala götürüldü (202 Accepted)!',
    };
  }

  @Post('no-content')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content (Cavab gövdəsi olmur)
  deleteSomething() {
    // 204 olduqda klientə heç bir response body qayıtmır
    return;
  }

  /**
   * 2️⃣ Custom HTTP Headers (Statik Response Başlıqları)
   * 
   * `@Header()` dekoratoru ilə cavaba xüsusi HTTP Header-lər əlavə edə bilərik.
   */
  @Get('custom-headers')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('X-Powered-By', 'NestJS Advanced Engine')
  @Header('X-Custom-Api-Version', 'v2.1.0')
  getWithHeaders() {
    return {
      message: 'Bu cavabla birlikdə 3 xüsusi HTTP Header göndərildi!',
    };
  }

  /**
   * 3️⃣ Static Redirection (Statik Yönləndirmə)
   * 
   * `@Redirect(url, statusCode)` dekoratoru ilə klient başqa səhifəyə yönləndirilir.
   * Susmaya görə status kodu 302 (Found / Temporary Redirect) olur.
   */
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  redirectToDocs() {
    // Metodun gövdəsi icra olunsa da, cavab avtomatik NestJS sənədləşməsinə yönlənir
  }

  /**
   * 4️⃣ Dynamic Redirection (Dinamik Yönləndirmə)
   * 
   * Sorğunun parametrindən (Query/Body) asılı olaraq yönləndiriləcək URL-i dinamik dəyişmək üçün
   * metoddan `{ url: string, statusCode?: number }` obyektini qaytarırıq.
   */
  @Get('version-redirect')
  @Redirect('https://docs.nestjs.com/v9', 302) // Fallback (standart) URL
  redirectDynamic(@Query('version') version: string) {
    if (version === '10') {
      return { url: 'https://docs.nestjs.com/v10', statusCode: 301 }; // Permanent Redirect
    }
    if (version === '11') {
      return { url: 'https://docs.nestjs.com', statusCode: 302 };
    }
    // Əgər obyekt qaytarmasaq, @Redirect-dəki fallback URL işləyəcək
  }

  /**
   * 5️⃣ Dynamic Headers & Response via @Res({ passthrough: true })
   * 
   * ⚠️ DİQQƏT: Əgər sən `@Res()` istifadə etsən, NestJS standart cavab mexanizmini dayandırır
   * və cavabı `res.send()` ilə əllə verməlisən.
   * Amma `passthrough: true` yazsan, həm Express `res` obyektindən dinamik header təyin edə bilərsən,
   * həm də NestJS cavabı normal `return` etməyə davam edər!
   */
  @Get('passthrough-demo')
  getPassthrough(@Res({ passthrough: true }) res: Response) {
    const timestamp = Date.now();
    
    // Dinamik olaraq header təyin edirik:
    res.header('X-Response-Time', `${timestamp}ms`);
    res.status(HttpStatus.OK);

    return {
      success: true,
      message: 'Passthrough rejimində həm res.header() işlədi, həm də return işləyir!',
    };
  }
}
