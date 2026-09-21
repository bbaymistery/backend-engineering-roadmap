import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

/**
 * 🛠️ Topic 73: Dynamic TypeORM Async Configuration
 * 
 * ConfigModule və ConfigService istifadə edərək .env faylından oxunan 
 * təhlükəsiz TypeORM konfiqurasiyası.
 */
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'nest_user'),
    password: configService.get<string>('DB_PASSWORD', 'nest_password'),
    database: configService.get<string>('DB_NAME', 'nest_database'),

    // 🔄 Entities avtomatik olaraq layihədən tapılıb yüklənir
    autoLoadEntities: true,

    // ⚠️ synchronize: true - Yalnız DEVELOPMENT mühitində istifadə olunmalıdır!
    // Kodda Entity dəyişən kimi PostgreSQL bazasında cədvəlləri avtomatik yaradır/yeniləyir.
    // PRODUCTION mühitində hər zaman `false` olunmalı və Migration istifadə edilməlidir!
    synchronize: configService.get<string>('NODE_ENV') !== 'production',

    // 📜 Bazaya göndərilən SQL sorğularını terminalda göstərir
    logging: configService.get<string>('NODE_ENV') === 'development',
  }),
  inject: [ConfigService],
};
