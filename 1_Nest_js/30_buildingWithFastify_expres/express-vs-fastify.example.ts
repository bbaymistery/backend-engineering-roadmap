import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Module } from '@nestjs/common';

// ==========================================
// 1. Platform-Agnostic Controller (DOĞRU YANAŞMA)
// ==========================================
// Bu Controller həm Express-də, həm də Fastify-da HEÇ BİR DƏYİŞİKLİK ETMƏDƏN işləyir.
@Controller('products')
export class ProductsController {
  @Get()
  getAllProducts() {
    // NestJS avtomatik olaraq aktiv adapterə uyğun JSON cavabı qaytarır
    return [
      { id: 1, name: 'Laptop', price: 1500 },
      { id: 2, name: 'Phone', price: 800 },
    ];
  }

  @Post()
  createProduct(@Body() body: { name: string; price: number }) {
    return {
      message: 'Məhsul uğurla yaradıldı!',
      data: body,
    };
  }
}

// ==========================================
// 2. App Module
// ==========================================
@Module({
  controllers: [ProductsController],
})
export class AppModule { }

// ==========================================
// 3. Fastify Bootstrap ilə Şəbəkəyə Qaldırılması
// ==========================================
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true, // Daxili Pino Logger
      trustProxy: true, // Proxy dəstəyi
      maxParamLength: 200, // Parametr uzunluğu
    }),
  );

  // Fastify üçün host parametri '0.0.0.0' verilməlidir
  await app.listen(3000, '0.0.0.0');
  console.log('🚀 Fastify tətbiqi 3000 portunda işə düşdü!');
}

// bootstrap();
