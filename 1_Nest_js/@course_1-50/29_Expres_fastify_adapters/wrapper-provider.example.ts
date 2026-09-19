// 📄 wrapper-provider.example.ts - Xarici Kitabxanaları Injectable Provider-ə Çevirmək (Providers as Wrappers)
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

// Nümunə: Xarici ORM / Database Klientini (Prisma/TypeORM) NestJS Provider-inə çeviririk
class DummyPrismaClient {
  async $connect() {
    console.log('🔌 Databazaya qoşulundu (PrismaClient)');
  }
  async $disconnect() {
    console.log('🔌 Databaza əlaqəsi kəsildi (PrismaClient)');
  }
}

@Injectable()
export class PrismaService
  extends DummyPrismaClient
  implements OnModuleInit, OnModuleDestroy {
  // Modul işə düşəndə databazaya qoşulur
  async onModuleInit() {
    await this.$connect();
  }

  // Modul bağlandıqda databaza əlaqəsini təhlükəsiz kəsir
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
