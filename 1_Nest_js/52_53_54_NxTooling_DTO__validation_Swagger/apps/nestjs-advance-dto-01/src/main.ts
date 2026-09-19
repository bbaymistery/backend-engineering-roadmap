import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Global ValidationPipe activation:
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO-da təyin olunmayan lazımsız sahələri avtomatik təmizləyir
      forbidNonWhitelisted: true, // DTO-da olmayan əlavə sahə göndərilərsə 400 Bad Request atır
      transform: true, // Gələn JSON obyektini avtomatik DTO klass tipinə çevirir
    }),
  );

  // 📑 Swagger OpenAPI setup:
  const config = new DocumentBuilder()
    .setTitle('NestJS Microservice API Documentation')
    .setDescription('Swagger OpenAPI Documentation with DTO Validation and Monorepo Shared Packages')
    .setVersion('1.0')
    .addTag('DTO Validation Test', 'DTO doğrulama və test üçün API nöqtələri')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4002);
  console.log(`📋 nestjs-advance-dto-01 running on: http://localhost:4002`);
  console.log(`📑 Swagger Documentation available on: http://localhost:4002/api/docs`);
}
bootstrap();
