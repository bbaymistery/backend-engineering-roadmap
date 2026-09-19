import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);

  // 📄 Swagger OpenAPI Konfiqurasiyası
  const config = new DocumentBuilder()
    .setTitle('NestJS Tədris Layihəsi API')
    .setDescription('Swagger OpenAPI ilə avtomatik generasiya olunmuş interaktiv API Sənədləşməsi')
    .setVersion('1.0')
    .addTag('users', 'İstifadəçi Əməliyyatları')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 📍 http://localhost:3000/api ünvanında açılacaq!

  await app.listen(port);
  console.log(`🚀 Server uğurla başladı: http://localhost:${port}`);
  console.log(`📚 Swagger API Sənədləşməsi: http://localhost:${port}/api`);
}
bootstrap();
