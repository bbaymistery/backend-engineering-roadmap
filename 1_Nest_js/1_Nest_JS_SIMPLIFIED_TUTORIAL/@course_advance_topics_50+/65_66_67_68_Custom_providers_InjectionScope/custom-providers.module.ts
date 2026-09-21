import { Module } from '@nestjs/common';
import {
  StripePaymentService,
  MockPaymentService,
} from './payment-strategy.service';
import {
  SingletonService,
  RequestScopedService,
  TransientService,
} from './injection-scopes.service';

// 🔑 Symbol Token (Interface injection üçün ən yaxşı təcrübə):
export const PAYMENT_SERVICE_TOKEN = Symbol('PAYMENT_SERVICE_TOKEN');

// 🔑 String Token (Konfiqurasiya obyekti üçün):
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

@Module({
  providers: [
    // 1️⃣ Standard Provider (Qısa sintaksis):
    SingletonService, // { provide: SingletonService, useClass: SingletonService } ilə eynidir

    // 2️⃣ Value Provider (useValue):
    // Statik konfiqurasiya, mock obyekt və ya sabit qiymət inject etmək üçün
    {
      provide: CONFIG_OPTIONS,
      useValue: {
        apiUrl: 'https://api.company.com/v1',
        timeout: 5000,
        maxRetries: 3,
      },
    },

    // 3️⃣ Class Provider (useClass):
    // Mühitə (DEV/PROD) görə hansı Klassın istifadə olunacağını dinamik dəyişmək üçün
    {
      provide: PAYMENT_SERVICE_TOKEN,
      useClass:
        process.env.NODE_ENV === 'production'
          ? StripePaymentService
          : MockPaymentService,
    },

    // 4️⃣ Factory Provider (useFactory):
    // İcra olunacaq obyekt başqa asılılıqlardan (Config, DB) asılı olduqda və asinkron yaradıldıqda
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (config: { apiUrl: string }) => {
        // İxtiyari asinkron yaradılma məntiqi:
        const connectionStatus = `Connected to DB via ${config.apiUrl}`;
        return {
          status: connectionStatus,
          connectedAt: new Date().toISOString(),
        };
      },
      inject: [CONFIG_OPTIONS], // useFactory funksiyasına ötürüləcək asılılıqlar
    },

    // 5️⃣ Existing Provider (useExisting - Alias):
    // Mövcud provider-ə yeni ad (alias) vermək üçün
    {
      provide: 'PRIMARY_SINGLETON_ALIAS',
      useExisting: SingletonService,
    },

    // Scope göstərilmiş servis-lər:
    RequestScopedService,
    TransientService,
  ],
  exports: [
    SingletonService,
    CONFIG_OPTIONS,
    PAYMENT_SERVICE_TOKEN,
    'DATABASE_CONNECTION',
  ],
})
export class CustomProvidersModule {}
