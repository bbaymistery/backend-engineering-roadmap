import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  BeforeApplicationShutdown,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';

@Injectable()
export class DatabaseLifecycleService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  private readonly logger = new Logger(DatabaseLifecycleService.name);
  private isConnected = false;

  /**
   * 1️⃣ onModuleInit()
   * 
   * Modulun asılılıqları (dependencies) həll edildikdən dərhal sonra çağırılır.
   * Asinkron (async) dəstəkləyir - NestJS bu metod bitənədək serverin açılmasını gözləyir!
   */
  async onModuleInit() {
    this.logger.log('🟡 [1. onModuleInit] Verilənlər bazasına qoşulma başlayır...');
    // Simulated DB Connection:
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.isConnected = true;
    this.logger.log('🟢 [1. onModuleInit] Verilənlər bazasına uğurla qoşuldu!');
  }

  /**
   * 2️⃣ onApplicationBootstrap()
   * 
   * Bütün modullar inicializasiya olunduqdan və HTTP server dinləməyə başlamazdan dərhal əvvəl çağırılır.
   */
  onApplicationBootstrap() {
    this.logger.log(
      '🟢 [2. onApplicationBootstrap] Bütün modullar hazırdır! HTTP Server işə düşür.',
    );
  }

  /**
   * 3️⃣ onModuleDestroy()
   * 
   * Server dayandırılma siqnalı (SIGINT/SIGTERM və ya app.close()) aldıqda İLK çağırılan hookdur.
   */
  onModuleDestroy() {
    this.logger.log('🟡 [3. onModuleDestroy] Serverin dayandırılması başladıldı...');
  }

  /**
   * 4️⃣ beforeApplicationShutdown(signal)
   * 
   * Şəbəkə qoşulmaları bağlanmazdan dərhal əvvəl çağırılır. Əldə olunan siqnalı (məs: SIGTERM) oxuya bilir.
   */
  beforeApplicationShutdown(signal?: string) {
    this.logger.log(
      `🟡 [4. beforeApplicationShutdown] Siqnal qəbul edildi: ${signal || 'MANUAL_CLOSE'}`,
    );
  }

  /**
   * 5️⃣ onApplicationShutdown(signal)
   * 
   * Bütün şəbəkə qoşulmaları bağlandıqdan sonra, proses tam sonlanmazdan əvvəl çağırılır.
   * DB bağlantılarını təhlükəsiz bağlamaq (Graceful Shutdown) üçün ən yaxşı yerdir.
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `🔴 [5. onApplicationShutdown] Verilənlər bazası bağlantısı təhlükəsiz bağlanır... (${signal})`,
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.isConnected = false;
    this.logger.log('🏁 [5. onApplicationShutdown] DB Bağlantısı tamamlandı. Server dayandı.');
  }

  getDbStatus(): boolean {
    return this.isConnected;
  }
}
