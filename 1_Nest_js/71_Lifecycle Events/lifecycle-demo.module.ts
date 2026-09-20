import { Module } from '@nestjs/common';
import { DatabaseLifecycleService } from './database-lifecycle.service';

@Module({
  providers: [DatabaseLifecycleService],
  exports: [DatabaseLifecycleService],
})
export class LifecycleDemoModule {}

/**
 * 💡 Graceful Shutdown Aktivləşdirmək Üçün `main.ts` Konfiqurasiyası:
 * 
 * ```typescript
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 * 
 *   // ⚠️ ÇOX VACİB: OS siqnallarını (SIGINT/SIGTERM) dinləmək və OnApplicationShutdown-ı aktiv etmək üçün:
 *   app.enableShutdownHooks();
 * 
 *   await app.listen(3000);
 * }
 * bootstrap();
 * ```
 */
