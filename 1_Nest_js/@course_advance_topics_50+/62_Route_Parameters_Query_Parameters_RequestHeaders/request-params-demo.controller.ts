import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Headers,
  Req,
  ParseIntPipe,
  ParseUUIDPipe,
  DefaultValuePipe,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('users')
export class RequestParamsDemoController {
  /**
   * 1️⃣ Route Parameters (@Param)
   * 
   * URL yolunda `:id` kimi dynamic parametrləri tutmaq üçün istifadə olunur.
   * Nümunə URL: GET /users/42
   */
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe string olaraq gələn "42"-ni avtomatik number tipli 42-yə çevirir!
    // Əgər hərf (məs: /users/abc) göndərilsə, avtomatik 400 Bad Request qaytarır.
    return {
      success: true,
      userId: id,
      typeOfId: typeof id, // "number"
    };
  }

  /**
   * 1.2️⃣ Multiple Route Parameters (Çoxlu URL Parametrləri)
   * 
   * Nümunə URL: GET /users/105/posts/88
   */
  @Get(':userId/posts/:postId')
  getUserPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return {
      userId,
      postId,
      message: `${userId} ID-li istifadəçinin ${postId} ID-li postu tapıldı`,
    };
  }

  /**
   * 1.3️⃣ All Route Parameters as Object (Bütün Parametrləri Obyekt Kimi Almaq)
   */
  @Get('category/:category/sub/:subcategory')
  getCategoryParams(@Param() params: { category: string; subcategory: string }) {
    return {
      category: params.category,
      subcategory: params.subcategory,
    };
  }

  /**
   * 2️⃣ Query Parameters (@Query)
   * 
   * URL-də `?key=value&key2=value2` kimi süzgəc (filtering), axtarış və səhifələmə parametrini tutmaq üçündür.
   * Nümunə URL: GET /users/search/filter?page=2&limit=10&search=ali&active=true
   */
  @Get('search/filter')
  filterUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return {
      page,
      limit,
      search: search || 'Hər hansı axtarış sözü daxil edilməyib',
      skip: (page - 1) * limit,
    };
  }

  /**
   * 2.2️⃣ All Query Parameters as Object (Bütün Query-ləri Obyekt Kimi Almaq)
   */
  @Get('search/all')
  getAllQueryParams(@Query() queryParams: Record<string, any>) {
    return {
      receivedQuery: queryParams,
    };
  }

  /**
   * 3️⃣ Request Headers (@Headers)
   * 
   * Klient tərəfindən HTTP sorğusu ilə birlikdə göndərilən başlığı (Authorization, User-Agent və s.) oxumaq üçündür.
   * Nümunə Header: Authorization: Bearer token123
   */
  @Get('profile/me')
  getProfile(
    @Headers('authorization') authHeader: string,
    @Headers('user-agent') userAgent: string,
    @Headers('x-api-key') apiKey?: string,
  ) {
    return {
      authHeader: authHeader || 'Authorization başlığı göndərilməyib!',
      clientBrowser: userAgent,
      apiKeyReceived: apiKey || 'X-API-KEY yoxdur',
    };
  }

  /**
   * 3.2️⃣ All Headers as Object (Bütün Header-ləri Almaq)
   */
  @Get('headers/all')
  getAllHeaders(@Headers() headers: Record<string, string>) {
    return {
      totalHeadersCount: Object.keys(headers).length,
      headers,
    };
  }

  /**
   * 4️⃣ Native @Req() vs NestJS Param Decorators
   * 
   * ⚠️ Niyə adicə `@Req() req: Request` yazmaq əvəzinə `@Param()`, `@Query()`, `@Headers()` istifadə edirik?
   * - Decoupling: NestJS tətbiqini Express-dən asılı etmir (Fastify-ə keçmək asanlaşır).
   * - Type Safety & Validation: Pipes (ParseIntPipe və s.) birbaşa işləyir.
   * - Unit Testing: Controller-ləri test etmək 10 dəfə asan olur.
   */
  @Get('raw/request-demo')
  getRawRequestInfo(@Req() req: Request) {
    return {
      ip: req.ip,
      method: req.method,
      path: req.path,
      rawQuery: req.query,
      rawParams: req.params,
    };
  }
}
