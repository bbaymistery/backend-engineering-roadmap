import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`🚀 Server uğurla başladı! Port: http://localhost:${port}`);
}
bootstrap();
