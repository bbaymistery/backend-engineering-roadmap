// 📄 di-providers.example.ts - DI Provider və Token Nümunələri
import { Module, Injectable, Inject } from '@nestjs/common';

// 1. Standart Klas Servislərimiz
@Injectable()
export class DevLoggerService {
  log(msg: string) {
    console.log(`[DEV LOG]: ${msg}`);
  }
}

@Injectable()
export class ProdLoggerService {
  log(msg: string) {
    console.log(`[PROD LOG]: ${msg}`);
  }
}

// 2. İnterfeys və Symbol Token (Interface-based Injection)
export interface PaymentGateway {
  pay(amount: number): string;
}

export const PAYMENT_GATEWAY_TOKEN = Symbol('PAYMENT_GATEWAY_TOKEN');

@Injectable()
export class StripeService implements PaymentGateway {
  pay(amount: number): string {
    return `${amount} AZN Stripe vasitəsilə ödənildi!`;
  }
}

// 3. AppModule daxilində Müxtəlif Provider Növlərinin Qeydiyyatı
@Module({
  providers: [
    // A) Standard Provider (Implicit / Explicit)
    {
      provide: DevLoggerService,
      useClass: DevLoggerService,
    },

    // B) Dynamic Class Provider (mühitə görə servis seçimi)
    {
      provide: 'LOGGER_SERVICE',
      useClass: process.env.NODE_ENV === 'production' ? ProdLoggerService : DevLoggerService,
    },

    // C) Value Provider (statik dəyər/konfiqurasiya)
    {
      provide: 'DATABASE_CONFIG',
      useValue: {
        host: 'localhost',
        port: 5432,
        dbName: 'my_nest_db',
      },
    },

    // D) Symbol Token & Class Provider
    {
      provide: PAYMENT_GATEWAY_TOKEN,
      useClass: StripeService,
    },

    // E) Factory Provider (Dinamik hazırlanan servis)
    {
      provide: 'CONNECTION_STRING',
      useFactory: (config: any) => {
        return `postgres://${config.host}:${config.port}/${config.dbName}`;
      },
      inject: ['DATABASE_CONFIG'], // 👈 Başqa provider-i factory-yə inject edirik!
    },
  ],
})
export class AppModule {}

// 4. Servislərin İstifadə Olunduğu Yer (Consumer)
@Injectable()
export class OrderService {
  constructor(
    @Inject('LOGGER_SERVICE') private readonly logger: any,
    @Inject('DATABASE_CONFIG') private readonly dbConfig: any,
    @Inject(PAYMENT_GATEWAY_TOKEN) private readonly paymentGateway: PaymentGateway,
    @Inject('CONNECTION_STRING') private readonly connectionString: string,
  ) {}

  processOrder() {
    this.logger.log(`DB Qoşulması: ${this.connectionString}`);
    const result = this.paymentGateway.pay(100);
    return result;
  }
}
