import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4001);
  console.log(`🔐 nestjs-advance-auth-app-02 running on: http://localhost:4001`);
}
bootstrap();
