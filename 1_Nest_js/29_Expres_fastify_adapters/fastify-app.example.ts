// 📄 fastify-app.example.ts - Fastify Adapter İlə NestJS Layihəsini Başlatmaq
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrapFastify() {
  // 📍 NestJS-ə bildiririk ki, standart Express yerinə FastifyAdapter istifadə etsin!
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }), // Fastify-ın daxili yüksək sürətli logger-ini aktiv edirik
  );

  const port = 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Fastify Əsaslı NestJS Serveri Başladı: http://localhost:${port}`);
}

// 📍 Müqayisə Üçün: Standart Express.js İlə Başlamaq (Default)
async function bootstrapExpress() {
  const app = await NestFactory.create(AppModule); // Default olaraq Express.js işləyir!
  await app.listen(3000);
}
